import 'server-only';

import Replicate from 'replicate';

import { env } from '@/lib/env';
import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';
import { prisma } from '@/lib/prisma';
import {
  deleteUsageHistoryEntry,
  reserveUsageHistoryEntry,
} from '@/lib/services/usage-history';

const replicate = new Replicate({ auth: env.REPLICATE_API_KEY });

const MODEL =
  'jyoung105/sdxl-turbo:93c488b9fbd6bea622d354c8dcce2724c5f67adb92ccf909038042a21c5238a7';

const CREDITS_PER_GENERATION = 1;

export type GenerateImageInput = {
  userId: string;
  prompt: string;
  aspectRatio: AspectRatioValue;
  style: StyleValue;
  webhookBaseUrl: string;
};

export type QueuedImageGenerationResult = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    credits: number;
    createdAt: Date;
  };
  usage: {
    id: string;
    prompt: string;
    creditsDeducted: number;
    creditsBefore: number;
    creditsAfter: number;
    aspectRatio: AspectRatioValue;
    style: StyleValue;
    outputImage: string;
    createdAt: Date;
  };
  predictionId: string;
  imageUrl: null;
  status: 'processing';
};

type ReplicateOutput = string | string[] | { url?: string } | null | undefined;

function buildReplicatePrompt(
  prompt: string,
  aspectRatio: AspectRatioValue,
  style: StyleValue,
) {
  const trimmedPrompt = prompt.trim();
  return `${trimmedPrompt}. The image should be of ${aspectRatio} and of style ${style}.`;
}

function getReplicateImageUrl(output: ReplicateOutput): string | null {
  if (!output) {
    return null;
  }

  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    return output.find(item => typeof item === 'string') ?? null;
  }

  if (typeof output === 'object' && typeof output.url === 'string') {
    return output.url;
  }

  return null;
}

function buildWebhookUrl(baseUrl: string, usageId: string) {
  const webhookUrl = new URL('/api/webhooks/replicate', baseUrl);
  webhookUrl.searchParams.set('usageId', usageId);
  return webhookUrl.toString();
}

export { getReplicateImageUrl };

export async function queueUserImageGeneration(
  input: GenerateImageInput,
): Promise<QueuedImageGenerationResult> {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      credits: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.credits < CREDITS_PER_GENERATION) {
    throw new Error('Not enough credits');
  }

  const creditsAfter = user.credits - CREDITS_PER_GENERATION;

  const usage = await prisma.$transaction(async tx => {
    const updatedCredits = await tx.user.updateMany({
      where: {
        id: user.id,
        credits: { gte: CREDITS_PER_GENERATION },
      },
      data: {
        credits: {
          decrement: CREDITS_PER_GENERATION,
        },
      },
    });

    if (updatedCredits.count === 0) {
      throw new Error('Not enough credits');
    }

    return reserveUsageHistoryEntry(
      {
        userId: user.id,
        prompt: input.prompt,
        creditsDeducted: CREDITS_PER_GENERATION,
        creditsBefore: user.credits,
        creditsAfter,
        aspectRatio: input.aspectRatio,
        style: input.style,
      },
      tx,
    );
  });

  try {
    const generatedPrompt = buildReplicatePrompt(
      input.prompt,
      input.aspectRatio,
      input.style,
    );

    const webhookUrl = buildWebhookUrl(input.webhookBaseUrl, usage.id);

    console.log('[replicate-generation] queueing prediction', {
      userId: input.userId,
      usageId: usage.id,
      webhookUrl,
    });

    const prediction = await replicate.predictions.create({
      version: MODEL,
      input: {
        prompt: generatedPrompt,
        guidance_scale: 7,
        steps: 1,
        width: 1024,
        height: 1024,
        use_highres_fix: true,
      },
      webhook: webhookUrl,
      webhook_events_filter: ['completed'],
    });

    console.log('[replicate-generation] prediction queued', {
      usageId: usage.id,
      predictionId: prediction.id,
      status: prediction.status,
    });

    return {
      user: {
        ...user,
        credits: creditsAfter,
      },
      usage,
      predictionId: prediction.id,
      imageUrl: null,
      status: 'processing',
    } satisfies QueuedImageGenerationResult;
  } catch (error) {
    await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          credits: {
            increment: CREDITS_PER_GENERATION,
          },
        },
      });

      await deleteUsageHistoryEntry(usage.id, tx);
    });

    throw error;
  }
}
