import 'server-only';

import {
  AspectRatio as PrismaAspectRatio,
  Style as PrismaStyle,
} from '@prisma/client';

import type { AspectRatioValue, StyleValue } from '@/lib/generation/options';
import { prisma } from '@/lib/prisma';

const DEFAULT_GALLERY_LIMIT = 20;
const MAX_GALLERY_LIMIT = 50;

const aspectRatioToPrismaValue: Record<AspectRatioValue, PrismaAspectRatio> = {
  '1:1': PrismaAspectRatio.RATIO_1_1,
  '4:3': PrismaAspectRatio.RATIO_4_3,
  '9:16': PrismaAspectRatio.RATIO_9_16,
  '16:9': PrismaAspectRatio.RATIO_16_9,
};

const prismaToAspectRatioValue: Record<PrismaAspectRatio, AspectRatioValue> = {
  [PrismaAspectRatio.RATIO_1_1]: '1:1',
  [PrismaAspectRatio.RATIO_4_3]: '4:3',
  [PrismaAspectRatio.RATIO_9_16]: '9:16',
  [PrismaAspectRatio.RATIO_16_9]: '16:9',
};

const styleToPrismaValue: Record<StyleValue, PrismaStyle> = {
  photoreal: PrismaStyle.PHOTOREAL,
  cinematic: PrismaStyle.CINEMATIC,
  anime: PrismaStyle.ANIME,
  'digital art': PrismaStyle.DIGITAL_ART,
};

const prismaToStyleValue: Record<PrismaStyle, StyleValue> = {
  [PrismaStyle.PHOTOREAL]: 'photoreal',
  [PrismaStyle.CINEMATIC]: 'cinematic',
  [PrismaStyle.ANIME]: 'anime',
  [PrismaStyle.DIGITAL_ART]: 'digital art',
};

export type UsageHistoryRecordInput = {
  userId: string;
  prompt: string;
  creditsDeducted: number;
  creditsBefore: number;
  creditsAfter: number;
  aspectRatio: AspectRatioValue;
  style: StyleValue;
  outputImage: string;
};

export type GalleryCursorPageInput = {
  userId: string;
  cursor?: string | null;
  limit?: number;
};

export type GalleryItem = {
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

export type GalleryPage = {
  items: GalleryItem[];
  nextCursor: string | null;
};
type UsageHistoryDbClient = {
  usageHistory: typeof prisma.usageHistory;
};

function clampLimit(limit?: number) {
  if (!limit || Number.isNaN(limit)) {
    return DEFAULT_GALLERY_LIMIT;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), MAX_GALLERY_LIMIT);
}

export async function recordUsageHistory(input: UsageHistoryRecordInput) {
  const created = await prisma.usageHistory.create({
    data: {
      userId: input.userId,
      prompt: input.prompt,
      creditsDeducted: input.creditsDeducted,
      creditsBefore: input.creditsBefore,
      creditsAfter: input.creditsAfter,
      aspectRatio: aspectRatioToPrismaValue[input.aspectRatio],
      style: styleToPrismaValue[input.style],
      outputImage: input.outputImage,
    },
    select: {
      id: true,
      userId: true,
      prompt: true,
      creditsDeducted: true,
      creditsBefore: true,
      creditsAfter: true,
      aspectRatio: true,
      style: true,
      outputImage: true,
      createdAt: true,
    },
  });

  return {
    ...created,
    aspectRatio: prismaToAspectRatioValue[created.aspectRatio],
    style: prismaToStyleValue[created.style],
  };
}

export async function reserveUsageHistoryEntry(
  input: Omit<UsageHistoryRecordInput, 'outputImage'>,
  tx: UsageHistoryDbClient = prisma,
) {
  const created = await tx.usageHistory.create({
    data: {
      userId: input.userId,
      prompt: input.prompt,
      creditsDeducted: input.creditsDeducted,
      creditsBefore: input.creditsBefore,
      creditsAfter: input.creditsAfter,
      aspectRatio: aspectRatioToPrismaValue[input.aspectRatio],
      style: styleToPrismaValue[input.style],
      outputImage: '',
    },
    select: {
      id: true,
      prompt: true,
      creditsDeducted: true,
      creditsBefore: true,
      creditsAfter: true,
      aspectRatio: true,
      style: true,
      outputImage: true,
      createdAt: true,
    },
  });

  return {
    ...created,
    aspectRatio: prismaToAspectRatioValue[created.aspectRatio],
    style: prismaToStyleValue[created.style],
  };
}

export async function finalizeUsageHistoryEntry(
  usageHistoryId: string,
  outputImage: string,
  tx: UsageHistoryDbClient = prisma,
) {
  const updated = await tx.usageHistory.update({
    where: {
      id: usageHistoryId,
    },
    data: {
      outputImage,
    },
    select: {
      id: true,
      prompt: true,
      creditsDeducted: true,
      creditsBefore: true,
      creditsAfter: true,
      aspectRatio: true,
      style: true,
      outputImage: true,
      createdAt: true,
    },
  });

  return {
    ...updated,
    aspectRatio: prismaToAspectRatioValue[updated.aspectRatio],
    style: prismaToStyleValue[updated.style],
  };
}

export async function deleteUsageHistoryEntry(
  usageHistoryId: string,
  tx: UsageHistoryDbClient = prisma,
) {
  await tx.usageHistory.delete({
    where: {
      id: usageHistoryId,
    },
  });
}

export async function getUsageHistoryEntryForUser(
  userId: string,
  usageHistoryId: string,
) {
  const usageHistory = await prisma.usageHistory.findFirst({
    where: {
      id: usageHistoryId,
      userId,
    },
    select: {
      id: true,
      prompt: true,
      creditsDeducted: true,
      creditsBefore: true,
      creditsAfter: true,
      aspectRatio: true,
      style: true,
      outputImage: true,
      createdAt: true,
    },
  });

  if (!usageHistory) {
    return null;
  }

  return {
    ...usageHistory,
    aspectRatio: prismaToAspectRatioValue[usageHistory.aspectRatio],
    style: prismaToStyleValue[usageHistory.style],
  };
}

export async function listUsageHistoryGallery(
  input: GalleryCursorPageInput,
): Promise<GalleryPage> {
  const limit = clampLimit(input.limit);

  const rows = await prisma.usageHistory.findMany({
    where: {
      userId: input.userId,
      outputImage: {
        not: '',
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(input.cursor
      ? {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }
      : {}),
    select: {
      id: true,
      prompt: true,
      creditsDeducted: true,
      creditsBefore: true,
      creditsAfter: true,
      aspectRatio: true,
      style: true,
      outputImage: true,
      createdAt: true,
    },
  });

  const items = rows.map(row => ({
    ...row,
    aspectRatio: prismaToAspectRatioValue[row.aspectRatio],
    style: prismaToStyleValue[row.style],
  }));

  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore
    ? (pageItems[pageItems.length - 1]?.id ?? null)
    : null;

  return {
    items: pageItems,
    nextCursor,
  };
}
