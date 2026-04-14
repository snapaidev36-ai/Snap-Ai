import 'server-only';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/auth/cookies';
import { isTokenExpiredError, verifyAccessToken } from '@/lib/auth/tokens';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  credits: number;
  createdAt: Date;
};

type AuthResult =
  | {
      user: CurrentUser;
      error?: never;
    }
  | {
      user?: never;
      error: NextResponse;
    };

export async function requireCurrentUser(
  request: NextRequest,
): Promise<AuthResult> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return {
      error: jsonError('No session found', 401),
    };
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
      return {
        error: jsonError('User not found', 404),
      };
    }

    return { user };
  } catch (error) {
    return {
      error: jsonError(
        isTokenExpiredError(error)
          ? 'Session expired. Please login again'
          : 'Invalid session. Please login again',
        401,
      ),
    };
  }
}
