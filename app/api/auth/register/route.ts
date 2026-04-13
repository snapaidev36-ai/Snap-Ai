import { Prisma } from '@prisma/client';

import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth/password';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation/auth';

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
    console.log('Existing user check result:', existingUser); // Debug log
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
      },
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error during user registration:', error); // Debug log

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return jsonError('Email is already registered', 409);
    }

    return jsonError('Internal server error', 500);
  }
}
