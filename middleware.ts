import { type NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAccessTokenCookie,
} from '@/lib/auth/cookies';
import { issueAccessTokenFromRefresh } from '@/lib/auth/refresh';
import { isTokenExpiredError, verifyAccessToken } from '@/lib/auth/tokens';

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);
  clearAuthCookies(response);

  return response;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);
      return NextResponse.next();
    } catch (error) {
      if (!isTokenExpiredError(error)) {
        return redirectToLogin(request);
      }
    }
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  try {
    const newAccessToken = await issueAccessTokenFromRefresh(refreshToken);
    const response = NextResponse.next();

    setAccessTokenCookie(response, newAccessToken);
    return response;
  } catch {
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/gallery/:path*'],
};
