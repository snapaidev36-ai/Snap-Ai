import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { listUsageHistoryGallery } from '@/lib/services/usage-history';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseLimit(value: string | null) {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.max(Math.trunc(parsed), 1), MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const cursor = request.nextUrl.searchParams.get('cursor');
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

  const page = await listUsageHistoryGallery({
    userId: authResult.user.id,
    cursor: cursor || null,
    limit,
  });

  const response = NextResponse.json({
    items: page.items,
    nextCursor: page.nextCursor,
  });

  response.headers.set('Cache-Control', 'no-store');

  return response;
}
