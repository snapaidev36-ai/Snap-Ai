import { NextResponse } from 'next/server';

import { clearAuthCookies } from '@/lib/auth/cookies';
import { hashPassword } from '@/lib/auth/password';
import { hashPasswordChangeToken } from '@/lib/auth/password-change';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { passwordUpdateRequestSchema } from '@/lib/validation/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = passwordUpdateRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const tokenHash = hashPasswordChangeToken(parsed.data.token);

  const user = await prisma.user.findFirst({
    where: {
      passwordChangeTokenHash: tokenHash,
      passwordChangeTokenExpiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return jsonError('Invalid or expired password update link', 400);
  }

  const password = await hashPassword(parsed.data.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password,
      passwordChangeTokenHash: null,
      passwordChangeTokenExpiresAt: null,
    },
  });

  const response = NextResponse.json({
    message: 'Password updated successfully',
  });

  clearAuthCookies(response);
  response.headers.set('Cache-Control', 'no-store');

  return response;
}
