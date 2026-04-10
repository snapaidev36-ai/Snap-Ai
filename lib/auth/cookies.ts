import type { NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export function setAccessTokenCookie(response: NextResponse, token: string) {
  response.cookies.set({
    ...baseCookieOptions,
    name: ACCESS_TOKEN_COOKIE_NAME,
    value: token,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
}

export function setRefreshTokenCookie(response: NextResponse, token: string) {
  response.cookies.set({
    ...baseCookieOptions,
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: token,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set({
    ...baseCookieOptions,
    name: ACCESS_TOKEN_COOKIE_NAME,
    value: '',
    maxAge: 0,
  });

  response.cookies.set({
    ...baseCookieOptions,
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: '',
    maxAge: 0,
  });
}
