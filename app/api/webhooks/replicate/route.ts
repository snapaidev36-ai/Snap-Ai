import { type Prediction, validateWebhook } from 'replicate';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { getReplicateImageUrl } from '@/lib/services/image-generation';
import {
  deleteUsageHistoryEntry,
  finalizeUsageHistoryEntry,
} from '@/lib/services/usage-history';
import { saveGeneratedImageFromUrl } from '@/lib/server/generated-images';

export const runtime = 'nodejs';

function getUsageId(request: NextRequest) {
  return request.nextUrl.searchParams.get('usageId');
}

export async function POST(request: NextRequest) {
  const usageId = getUsageId(request);

  if (!usageId) {
    console.warn('[replicate-webhook] missing usageId query param');
    return jsonError('Missing usageId', 400);
  }

  const validationSecret = env.REPLICATE_WEBHOOK_SIGNING_SECRET;
  if (validationSecret) {
    const isValid = await validateWebhook(request.clone(), validationSecret);

    if (!isValid) {
      console.warn('[replicate-webhook] invalid signature', { usageId });
      return jsonError('Webhook is invalid', 401);
    }
  } else {
    console.warn(
      '[replicate-webhook] signing secret missing, skipping validation',
      {
        usageId,
      },
    );
  }

  const prediction = (await request.json()) as Prediction;

  console.log('[replicate-webhook] received prediction', {
    usageId,
    predictionId: prediction.id,

    status: prediction.status,
    hasOutput: Boolean(prediction.output),
    completedAt: prediction.completed_at,
  });

  const usage = await prisma.usageHistory.findUnique({
    where: { id: usageId },
    select: {
      id: true,
      userId: true,
      creditsDeducted: true,
      outputImage: true,
    },
  });

  if (!usage) {
    console.warn('[replicate-webhook] usage history row not found', {
      usageId,
    });
    return NextResponse.json(
      { ok: true, detail: 'Usage not found' },
      { status: 200 },
    );
  }

  if (usage.outputImage) {
    console.log(
      '[replicate-webhook] usage already finalized, ignoring duplicate event',
      {
        usageId,
        predictionId: prediction.id,
      },
    );
    return NextResponse.json(
      { ok: true, detail: 'Already processed' },
      { status: 200 },
    );
  }

  if (prediction.status !== 'succeeded') {
    console.warn(
      '[replicate-webhook] prediction completed without success, rolling back',
      {
        usageId,
        predictionId: prediction.id,
        status: prediction.status,
      },
    );

    await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { id: usage.userId },
        data: {
          credits: {
            increment: usage.creditsDeducted,
          },
        },
      });

      await deleteUsageHistoryEntry(usage.id, tx);
    });

    return NextResponse.json(
      {
        ok: true,
        detail: 'Prediction failed and usage was rolled back',
        status: prediction.status,
      },
      { status: 200 },
    );
  }

  const imageUrl = getReplicateImageUrl(prediction.output as never);

  if (!imageUrl) {
    console.error(
      '[replicate-webhook] missing image output for completed prediction',
      {
        usageId,
        predictionId: prediction.id,
        prediction,
      },
    );
    return jsonError('Completed prediction did not include an image', 500);
  }

  console.log('[replicate-webhook] downloading generated image', {
    usageId,
    predictionId: prediction.id,
    imageUrl,
  });

  await saveGeneratedImageFromUrl(usage.id, imageUrl);

  const publicImageUrl = `/api/images?imageId=${usage.id}`;
  const updatedUsage = await finalizeUsageHistoryEntry(
    usage.id,
    publicImageUrl,
  );

  console.log('[replicate-webhook] finalized usage history', {
    usageId,
    predictionId: prediction.id,
    outputImage: publicImageUrl,
  });

  return NextResponse.json(
    {
      ok: true,
      detail: 'Prediction completed',
      usage: updatedUsage,
      imageUrl: publicImageUrl,
    },
    { status: 200 },
  );
}
