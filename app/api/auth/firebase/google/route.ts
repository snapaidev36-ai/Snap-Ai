import { Prisma } from '@prisma/client';

import { NextResponse } from 'next/server';

import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '@/lib/auth/cookies';
import { verifyFirebaseIdToken } from '@/lib/auth/firebase-admin';
import { signAccessToken, signRefreshToken } from '@/lib/auth/tokens';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { firebaseGoogleLoginSchema } from '@/lib/validation/auth';

export const runtime = 'nodejs';

function getNameParts(name?: string) {
  const trimmedName = name?.trim() ?? '';

  if (!trimmedName) {
    return {
      firstName: 'Google',
      lastName: 'User',
    };
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? 'Google';
  const lastName = parts.slice(1).join(' ') || 'User';

  return {
    firstName: firstName.slice(0, 60),
    lastName: lastName.slice(0, 60),
  };
}

export async function POST(request: Request) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = firebaseGoogleLoginSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }

    let decodedToken;

    try {
      decodedToken = await verifyFirebaseIdToken(parsed.data.idToken);
    } catch {
      return jsonError('Invalid or expired Firebase token', 401);
    }

    if (!decodedToken.email) {
      return jsonError('Google account email is required', 400);
    }

    const email = decodedToken.email.trim().toLowerCase();
    const { firstName, lastName } = getNameParts(decodedToken.name);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ firebaseUid: decodedToken.uid }, { email }],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        authProvider: true,
        credits: true,
        createdAt: true,
      },
    });

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firebaseUid: decodedToken.uid,
            authProvider:
              existingUser.authProvider === 'email' ? 'email' : 'google',
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            credits: true,
            createdAt: true,
          },
        })
      : await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: null,
            firebaseUid: decodedToken.uid,
            authProvider: 'google',
            credits: 0,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            credits: true,
            createdAt: true,
          },
        });

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id, email: user.email }),
      signRefreshToken({ userId: user.id, email: user.email }),
    ]);

    const response = NextResponse.json({
      message: 'Google login successful',
      redirectTo: '/dashboard',
      user,
    });

    setAccessTokenCookie(response, accessToken);
    setRefreshTokenCookie(response, refreshToken);
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return jsonError('Unable to link Google account to this user', 409);
    }

    return jsonError('Internal server error', 500);
  }
}
