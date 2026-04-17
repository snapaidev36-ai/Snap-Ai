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
  profileImageKey: string | null;
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

type CookieStoreLike = {
  get(name: string): { value?: string } | undefined;
};

class CurrentUserNotFoundError extends Error {
  constructor() {
    super('User not found');
    this.name = 'CurrentUserNotFoundError';
  }
}

async function findCurrentUser(accessToken: string): Promise<CurrentUser> {
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
      profileImageKey: true,
    },
  });

  if (!user) {
    throw new CurrentUserNotFoundError();
  }

  return user;
}

export async function getCurrentUserFromCookies(
  cookieStore: CookieStoreLike,
): Promise<CurrentUser | null> {
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    return await findCurrentUser(accessToken);
  } catch {
    return null;
  }
}

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
    return { user: await findCurrentUser(accessToken) };
  } catch (error) {
    if (error instanceof CurrentUserNotFoundError) {
      return {
        error: jsonError('User not found', 404),
      };
    }

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
