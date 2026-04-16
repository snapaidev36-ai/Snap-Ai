import { type NextRequest, NextResponse } from 'next/server';

import { buildGeneratedImageProxyUrl } from '@/lib/server/generated-images';
import { listCommunityFeed } from '@/lib/services/usage-history';

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
  const cursor = request.nextUrl.searchParams.get('cursor');
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

  const page = await listCommunityFeed({
    cursor: cursor || null,
    limit,
  });

  const response = NextResponse.json({
    items: page.items.map(item => ({
      id: item.id,
      prompt: item.prompt,
      creditsDeducted: item.creditsDeducted,
      creditsBefore: item.creditsBefore,
      creditsAfter: item.creditsAfter,
      aspectRatio: item.aspectRatio,
      style: item.style,
      createdAt: item.createdAt,
      user: item.user,
      imageUrl: buildGeneratedImageProxyUrl(item.id, 'community'),
    })),
    nextCursor: page.nextCursor,
  });

  response.headers.set('Cache-Control', 'no-store');

  return response;
}
