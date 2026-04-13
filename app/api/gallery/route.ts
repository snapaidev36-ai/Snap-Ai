import { type NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/auth/cookies';
import { isTokenExpiredError, verifyAccessToken } from '@/lib/auth/tokens';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
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
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return jsonError('No session found', 401);
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    const cursor = request.nextUrl.searchParams.get('cursor');
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });

    if (!user) {
      return jsonError('User not found', 404);
    }

    const page = await listUsageHistoryGallery({
      userId: payload.userId,
      cursor: cursor || null,
      limit,
    });

    const response = NextResponse.json({
      items: page.items,
      nextCursor: page.nextCursor,
    });

    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    return jsonError(
      isTokenExpiredError(error)
        ? 'Session expired. Please login again'
        : 'Invalid session. Please login again',
      401,
    );
  }
}
