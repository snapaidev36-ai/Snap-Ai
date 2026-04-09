import { ZodError } from 'zod';

import { NextResponse } from 'next/server';

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonValidationError(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      fields: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}
