import type { NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const AUTH_HINT_COOKIE_NAME = 'authHint';

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

const authHintCookieOptions = {
  httpOnly: false,
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

export function setAuthHintCookie(response: NextResponse) {
  response.cookies.set({
    ...authHintCookieOptions,
    name: AUTH_HINT_COOKIE_NAME,
    value: '1',
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function clearAuthHintCookie(response: NextResponse) {
  response.cookies.set({
    ...authHintCookieOptions,
    name: AUTH_HINT_COOKIE_NAME,
    value: '',
    maxAge: 0,
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

  clearAuthHintCookie(response);
}
