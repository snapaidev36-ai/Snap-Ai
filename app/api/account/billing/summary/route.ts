import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { formatBillingRangeLabel, parseBillingDateRange } from '@/lib/billing';
import { jsonError, jsonValidationError } from '@/lib/http';
import { getBillingSummary } from '@/lib/services/billing';

export const runtime = 'nodejs';

const billingQuerySchema = z.object({
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const parsed = billingQuerySchema.safeParse({
    from: request.nextUrl.searchParams.get('from'),
    to: request.nextUrl.searchParams.get('to'),
  });

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const range = parseBillingDateRange(parsed.data);

  if (!range) {
    return jsonError('Invalid billing date range', 400);
  }

  try {
    const summary = await getBillingSummary(authResult.user.id, range);

    const response = NextResponse.json({
      range,
      label: formatBillingRangeLabel(range),
      summary,
    });

    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unable to load billing summary',
      500,
    );
  }
}
