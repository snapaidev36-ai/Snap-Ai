import 'server-only';

import { Buffer } from 'node:buffer';

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { imageSize } from 'image-size';

import { env } from '@/lib/env';
import { getFileExtensionFromContentType } from '@/lib/helpers';
import { r2Client } from '@/lib/server/r2';

const GENERATED_IMAGE_FOLDER = 'snap-ai/generated';
const R2_CACHE_CONTROL = 'private, no-store';

export type GeneratedImageVariant = 'gallery' | 'community';

export type UploadedGeneratedImage = {
  objectKey: string;
  contentType: string;
};

type GeneratedImageDimensions = {
  width: number | null;
  height: number | null;
};

export function buildGeneratedImageProxyUrl(
  imageId: string,
  variant: GeneratedImageVariant = 'gallery',
) {
  const searchParams = new URLSearchParams({ imageId });

  if (variant === 'community') {
    searchParams.set('variant', 'community');
  }

  return `/api/images?${searchParams.toString()}`;
}

function getGeneratedImageObjectKey(input: {
  userId: string;
  usageId: string;
  contentType: string;
}) {
  const extension = getFileExtensionFromContentType(input.contentType);

  return `${GENERATED_IMAGE_FOLDER}/${input.userId}/${input.usageId}${extension}`;
}

async function readBodyToBuffer(body: unknown) {
  if (
    !body ||
    typeof (body as AsyncIterable<unknown>)[Symbol.asyncIterator] !== 'function'
  ) {
    throw new Error('Generated image body is not readable');
  }

  const chunks: Buffer[] = [];

  for await (const chunk of body as AsyncIterable<
    Buffer | Uint8Array | string
  >) {
    if (typeof chunk === 'string') {
      chunks.push(Buffer.from(chunk));
      continue;
    }

    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getGeneratedImageDimensions(body: Buffer): GeneratedImageDimensions {
  try {
    const dimensions = imageSize(body);

    if (!dimensions.width || !dimensions.height) {
      return { width: null, height: null };
    }

    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch {
    return { width: null, height: null };
  }
}

export function buildCommunityWatermarkSvg(
  imageDataUri: string,
  dimensions: GeneratedImageDimensions,
) {
  const safeImageDataUri = escapeXml(imageDataUri);
  const width = dimensions.width ?? 1000;
  const height = dimensions.height ?? 1000;
  const watermarkFontSize = Math.max(
    Math.round(Math.min(width, height) * 0.035),
    12,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.28" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#111111" />
  <image href="${safeImageDataUri}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
  <rect width="100%" height="100%" fill="url(#overlay)" />
  <text x="95%" y="95%" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="${watermarkFontSize}" font-weight="700" fill="#ffffff" fill-opacity="0.42" letter-spacing="0.12em">SNAP AI</text>
</svg>`;
}

export async function uploadGeneratedImageFromUrl(input: {
  userId: string;
  usageId: string;
  imageUrl: string;
}): Promise<UploadedGeneratedImage> {
  const response = await fetch(input.imageUrl);

  if (!response.ok) {
    throw new Error('Unable to download generated image');
  }

  const contentType = response.headers.get('content-type') ?? 'image/png';
  const objectKey = getGeneratedImageObjectKey({
    userId: input.userId,
    usageId: input.usageId,
    contentType,
  });

  try {
    const body = Buffer.from(await response.arrayBuffer());

    await r2Client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
        CacheControl: R2_CACHE_CONTROL,
      }),
    );

    return {
      objectKey,
      contentType,
    };
  } catch (error) {
    console.error('[generated-images] r2 upload failed', {
      userId: input.userId,
      usageId: input.usageId,
      objectKey,
      imageUrl: input.imageUrl,
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

export async function readGeneratedImageFromStorage(objectKey: string) {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
    }),
  );

  if (!response.Body) {
    throw new Error('Generated image not found');
  }

  const body = await readBodyToBuffer(response.Body);
  const dimensions = getGeneratedImageDimensions(body);

  return {
    body,
    contentType: response.ContentType ?? 'image/png',
    ...dimensions,
  };
}
