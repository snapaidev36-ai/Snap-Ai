import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { jsonError } from '@/lib/http';
import { getUsageHistoryEntryForUser } from '@/lib/services/usage-history';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const usageId = request.nextUrl.searchParams.get('usageId');

  if (!usageId) {
    return jsonError('Usage id is required', 400);
  }

  const authResult = await requireCurrentUser(request);
  if ('error' in authResult) {
    return authResult.error;
  }

  const usage = await getUsageHistoryEntryForUser(authResult.user.id, usageId);

  if (!usage) {
    return jsonError('Generation not found', 404);
  }

  const imageUrl = usage.outputImage || null;
  const response = NextResponse.json(
    {
      status: imageUrl ? 'completed' : 'processing',
      imageUrl,
      usage: {
        ...usage,
        createdAt: usage.createdAt.toISOString(),
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );

  return response;
}
