import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { listLatestUserPrompts } from '@/lib/services/usage-history';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const prompts = await listLatestUserPrompts(authResult.user.id, 3);

  const response = NextResponse.json(prompts);
  response.headers.set('Cache-Control', 'no-store');

  return response;
}
