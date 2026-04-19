import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { createPasswordChangeToken } from '@/lib/auth/password-change';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { sendPasswordChangeEmail } from '@/lib/services/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const { token, tokenHash, expiresAt } = createPasswordChangeToken();

  await prisma.user.update({
    where: { id: authResult.user.id },
    data: {
      passwordChangeTokenHash: tokenHash,
      passwordChangeTokenExpiresAt: expiresAt,
    },
  });

  try {
    await sendPasswordChangeEmail({
      siteUrl: env.APP_URL ?? request.nextUrl.origin,
      to: authResult.user.email,
      firstName: authResult.user.firstName,
      updatePasswordUrl: `${env.APP_URL ?? request.nextUrl.origin}/update-password?token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        passwordChangeTokenHash: null,
        passwordChangeTokenExpiresAt: null,
      },
    });

    const message =
      error instanceof Error ? error.message : 'Unable to send email';

    return jsonError(message, 500);
  }

  const response = NextResponse.json({
    message: 'Password change email sent',
  });

  response.headers.set('Cache-Control', 'no-store');

  return response;
}
