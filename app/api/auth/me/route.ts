import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/auth/cookies';
import { isTokenExpiredError, verifyAccessToken } from '@/lib/auth/tokens';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return jsonError('No session found', 401);
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) {
      return jsonError('User not found', 404);
    }

    const response = NextResponse.json({ user });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    return jsonError(
      isTokenExpiredError(error)
        ? 'Session expired. Please login again'
        : 'Invalid session. Please login again',
      401,
    );
  }
}
