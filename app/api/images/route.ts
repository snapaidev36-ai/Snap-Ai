import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import {
  buildCommunityWatermarkSvg,
  readGeneratedImageFromStorage,
} from '@/lib/server/generated-images';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const imageId = request.nextUrl.searchParams.get('imageId');
  const variant =
    request.nextUrl.searchParams.get('variant') === 'community'
      ? 'community'
      : 'gallery';

  if (!imageId) {
    return jsonError('Image id is required', 400);
  }

  if (variant === 'gallery') {
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
        outputImage: true,
      },
    });

    if (!imageRecord) {
      return jsonError('Image not found', 404);
    }

    try {
      const asset = await readGeneratedImageFromStorage(
        imageRecord.outputImage,
      );

      return new NextResponse(asset.body, {
        status: 200,
        headers: {
          'Content-Type': asset.contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      return jsonError('Image not found', 404);
    }
  }

  const imageRecord = await prisma.usageHistory.findFirst({
    where: {
      id: imageId,
      outputImage: {
        not: '',
      },
    },
    select: {
      id: true,
      outputImage: true,
    },
  });

  if (!imageRecord) {
    return jsonError('Image not found', 404);
  }

  try {
    const asset = await readGeneratedImageFromStorage(imageRecord.outputImage);

    const svg = buildCommunityWatermarkSvg(
      `data:${asset.contentType};base64,${Buffer.from(asset.body).toString('base64')}`,
      {
        width: asset.width,
        height: asset.height,
      },
    );

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return jsonError('Image not found', 404);
  }
}
