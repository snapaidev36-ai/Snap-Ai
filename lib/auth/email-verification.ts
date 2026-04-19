import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

import { prisma } from '@/lib/prisma';

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashEmailVerificationToken(token);

  return {
    token,
    tokenHash,
  };
}

export function hashEmailVerificationToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function verifyEmailVerificationToken(token: string) {
  const tokenHash = hashEmailVerificationToken(token);

  const user = await prisma.user.findFirst({
    where: { emailVerificationTokenHash: tokenHash },
    select: {
      id: true,
      firstName: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  if (!user.emailVerifiedAt) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
      },
    });
  }

  return user;
}
