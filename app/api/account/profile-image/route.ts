import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { jsonError } from '@/lib/http';
import { readProfileImageFromStorage } from '@/lib/server/profile-images';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  if (!authResult.user.profileImageKey) {
    return jsonError('Profile image not found', 404);
  }

  const image = await readProfileImageFromStorage(
    authResult.user.profileImageKey,
  );

  return new NextResponse(image.body, {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'private, no-store',
    },
  });
}
