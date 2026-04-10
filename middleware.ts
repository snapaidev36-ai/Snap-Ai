import { type NextRequest, NextResponse } from 'next/server';

import {
  AUTH_HINT_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAccessTokenCookie,
  setAuthHintCookie,
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

function redirectToDashboard(request: NextRequest) {
  const dashboardUrl = new URL('/dashboard', request.url);
  return NextResponse.redirect(dashboardUrl);
}

function continueToLoginAndClearAuth() {
  const response = NextResponse.next();
  clearAuthCookies(response);
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === '/login';
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const authHint = request.cookies.get(AUTH_HINT_COOKIE_NAME)?.value;

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
          return continueToLoginAndClearAuth();
        }

        return redirectToLogin(request);
      }
    }
  }

  if (!refreshToken) {
    if (isLoginRoute) {
      if (accessToken || authHint) {
        return continueToLoginAndClearAuth();
      }

      return NextResponse.next();
    }

    return redirectToLogin(request);
  }

  try {
    const newAccessToken = await issueAccessTokenFromRefresh(refreshToken);
    const response = isLoginRoute
      ? redirectToDashboard(request)
      : NextResponse.next();

    setAccessTokenCookie(response, newAccessToken);
    setAuthHintCookie(response);

    return response;
  } catch {
    if (isLoginRoute) {
      return continueToLoginAndClearAuth();
    }

    return redirectToLogin(request);
  }
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/profile/:path*',
    '/gallery/:path*',
  ],
};
