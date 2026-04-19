import { type NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import { stringify } from 'csv-stringify';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { formatBillingRangeLabel, parseBillingDateRange } from '@/lib/billing';
import { jsonError } from '@/lib/http';
import {
  BILLING_TRANSACTION_CSV_COLUMNS,
  iterateBillingTransactions,
} from '@/lib/services/billing';

export const runtime = 'nodejs';

function getExportFileName(rangeLabel: string) {
  return `billing-transactions_${rangeLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}.csv`;
}

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const range = parseBillingDateRange({
    from: request.nextUrl.searchParams.get('from'),
    to: request.nextUrl.searchParams.get('to'),
  });

  if (!range) {
    return jsonError('Invalid billing date range', 400);
  }

  const rangeLabel = formatBillingRangeLabel(range);
  const fileName = getExportFileName(rangeLabel);
  const csvStream = stringify({
    bom: true,
    header: true,
    columns: BILLING_TRANSACTION_CSV_COLUMNS,
  });

  Readable.from(iterateBillingTransactions(authResult.user.id, range), {
    objectMode: true,
  }).pipe(csvStream);

  const stream = Readable.toWeb(csvStream) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}
