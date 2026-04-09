import { type NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAccessTokenCookie,
} from '@/lib/auth/cookies';
import { issueAccessTokenFromRefresh } from '@/lib/auth/refresh';
import { isTokenExpiredError, verifyAccessToken } from '@/lib/auth/tokens';

function redirectToDashboard(request: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);
  clearAuthCookies(response);

  return response;
}

export async function middleware(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === '/login';
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);

      if (isLoginRoute) {
        return redirectToDashboard(request);
      }

      return NextResponse.next();
    } catch (error) {
      if (!isTokenExpiredError(error)) {
        if (isLoginRoute) {
          const response = NextResponse.next();
          clearAuthCookies(response);
          return response;
        }

        return redirectToLogin(request);
      }
    }
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    if (isLoginRoute) {
      return NextResponse.next();
    }

    return redirectToLogin(request);
  }

  try {
    const newAccessToken = await issueAccessTokenFromRefresh(refreshToken);

    if (isLoginRoute) {
      const response = redirectToDashboard(request);
      setAccessTokenCookie(response, newAccessToken);
      return response;
    }

    const response = NextResponse.next();

    setAccessTokenCookie(response, newAccessToken);
    return response;
  } catch {
    if (isLoginRoute) {
      const response = NextResponse.next();
      clearAuthCookies(response);
      return response;
    }

    return redirectToLogin(request);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/gallery/:path*',
    '/login',
  ],
};
