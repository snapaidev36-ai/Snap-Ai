import { NextRequest, NextResponse } from 'next/server';

import {
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthHintCookie,
  setAccessTokenCookie,
} from '@/lib/auth/cookies';
import { issueAccessTokenFromRefresh } from '@/lib/auth/refresh';
import { isTokenExpiredError } from '@/lib/auth/tokens';
import { jsonError } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    const response = jsonError('Refresh token is missing', 401);
    clearAuthCookies(response);
    return response;
  }

  try {
    const accessToken = await issueAccessTokenFromRefresh(refreshToken);

    const response = NextResponse.json({ message: 'Session refreshed' });
    setAccessTokenCookie(response, accessToken);
    setAuthHintCookie(response);
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    const response = jsonError(
      isTokenExpiredError(error)
        ? 'Session expired. Please login again'
        : 'Invalid session. Please login again',
      401,
    );

    clearAuthCookies(response);
    return response;
  }
}
