import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { formatBillingRangeLabel, parseBillingDateRange } from '@/lib/billing';
import { jsonError, jsonValidationError } from '@/lib/http';
import { listBillingTransactions } from '@/lib/services/billing';

export const runtime = 'nodejs';

const billingTransactionsQuerySchema = z
  .object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    cursor: z
      .string()
      .regex(/^[a-f0-9]{24}$/i)
      .optional(),
    limit: z.coerce.number().int().min(1).max(25).optional(),
  })
  .strict();

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const parsed = billingTransactionsQuerySchema.safeParse({
    from: request.nextUrl.searchParams.get('from'),
    to: request.nextUrl.searchParams.get('to'),
    cursor: request.nextUrl.searchParams.get('cursor') ?? undefined,
    limit: request.nextUrl.searchParams.get('limit') ?? undefined,
  });

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const range = parseBillingDateRange({
    from: parsed.data.from,
    to: parsed.data.to,
  });

  if (!range) {
    return jsonError('Invalid billing date range', 400);
  }

  try {
    const page = await listBillingTransactions(authResult.user.id, {
      from: range.from,
      to: range.to,
      cursor: parsed.data.cursor,
      limit: parsed.data.limit,
    });

    const response = NextResponse.json({
      range,
      label: formatBillingRangeLabel(range),
      ...page,
    });

    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : 'Unable to load billing transactions',
      500,
    );
  }
}
