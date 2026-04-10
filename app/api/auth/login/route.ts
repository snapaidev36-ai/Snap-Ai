import { NextResponse } from 'next/server';

import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '@/lib/auth/cookies';
import { signAccessToken, signRefreshToken } from '@/lib/auth/tokens';
import { verifyPassword } from '@/lib/auth/password';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        authProvider: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user || !user.password) {
      return jsonError('Invalid email or password', 401);
    }

    const isPasswordValid = await verifyPassword(
      parsed.data.password,
      user.password,
    );

    if (!isPasswordValid) {
      return jsonError('Invalid email or password', 401);
    }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id, email: user.email }),
      signRefreshToken({ userId: user.id, email: user.email }),
    ]);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        credits: user.credits,
        createdAt: user.createdAt,
      },
    });

    setAccessTokenCookie(response, accessToken);
    setRefreshTokenCookie(response, refreshToken);
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch {
    return jsonError('Internal server error', 500);
  }
}
