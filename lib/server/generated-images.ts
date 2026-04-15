import 'server-only';

import { Buffer } from 'node:buffer';

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import mime from 'mime-types';

import { env } from '@/lib/env';

const GENERATED_IMAGE_FOLDER = 'snap-ai/generated';
const R2_CACHE_CONTROL = 'private, no-store';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.R2_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.R2_ACCESS_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export type GeneratedImageVariant = 'gallery' | 'community';

export type UploadedGeneratedImage = {
  objectKey: string;
  contentType: string;
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

function getFileExtension(contentType: string) {
  const normalizedContentType = contentType
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
  const extension = mime.extension(normalizedContentType);

  if (typeof extension === 'string' && extension.length > 0) {
    return `.${extension}`;
  }

  return '.png';
}

function getGeneratedImageObjectKey(input: {
  userId: string;
  usageId: string;
  contentType: string;
}) {
  const extension = getFileExtension(input.contentType);

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

export function buildCommunityWatermarkSvg(imageDataUri: string) {
  const safeImageDataUri = escapeXml(imageDataUri);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.28" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#111111" />
  <image href="${safeImageDataUri}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
  <rect width="100%" height="100%" fill="url(#overlay)" />
  <text x="952" y="946" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff" fill-opacity="0.42" letter-spacing="0.12em">SNAP AI</text>
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

  return {
    body,
    contentType: response.ContentType ?? 'image/png',
  };
}
