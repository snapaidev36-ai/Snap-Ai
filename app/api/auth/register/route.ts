import { Prisma } from '@prisma/client';

import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth/password';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation/auth';
import { toAuthUser } from '@/lib/auth/user-profile';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });
    if (existingUser) {
      return jsonError('Email is already registered', 409);
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        password: passwordHash,
        credits: 0,
      },
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

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: toAuthUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return jsonError('Email is already registered', 409);
    }

    return jsonError('Internal server error', 500);
  }
}
