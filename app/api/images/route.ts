import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { readGeneratedImage } from '@/lib/server/generated-images';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const imageId = request.nextUrl.searchParams.get('imageId');

  if (!imageId) {
    return jsonError('Image id is required', 400);
  }

  const authResult = await requireCurrentUser(request);
  if ('error' in authResult) {
    return authResult.error;
  }

  const imageRecord = await prisma.usageHistory.findFirst({
    where: {
      id: imageId,
      userId: authResult.user.id,
      outputImage: {
        not: '',
      },
    },
    select: {
      id: true,
    },
  });

  if (!imageRecord) {
    return jsonError('Image not found', 404);
  }

  try {
    const imageBuffer = await readGeneratedImage(imageId);
    const response = new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, no-store',
      },
    });

    return response;
  } catch {
    return jsonError('Image not found', 404);
  }
}
