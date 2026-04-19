import 'server-only';

import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

import { env } from '@/lib/env';
import { getFileExtensionFromContentType } from '@/lib/helpers';
import { r2Client } from '@/lib/server/r2';

const PROFILE_IMAGE_FOLDER = 'snap-ai/profile-images';
const PROFILE_IMAGE_CACHE_CONTROL = 'private, no-store';

export type UploadedProfileImage = {
  objectKey: string;
  contentType: string;
};

export type ProfileImageData = {
  body: Buffer;
  contentType: string;
};

function getProfileImageObjectKey(input: {
  userId: string;
  contentType: string;
}) {
  const extension = getFileExtensionFromContentType(input.contentType);
  return `${PROFILE_IMAGE_FOLDER}/${input.userId}/${Date.now()}-${randomUUID()}${extension}`;
}

export async function uploadProfileImageFromBuffer(input: {
  userId: string;
  body: Buffer;
  contentType: string;
}): Promise<UploadedProfileImage> {
  const objectKey = getProfileImageObjectKey({
    userId: input.userId,
    contentType: input.contentType,
  });

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: PROFILE_IMAGE_CACHE_CONTROL,
    }),
  );

  return {
    objectKey,
    contentType: input.contentType,
  };
}

export async function readProfileImageFromStorage(objectKey: string) {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
    }),
  );

  if (!response.Body) {
    throw new Error('Profile image not found');
  }

  const chunks: Buffer[] = [];

  for await (const chunk of response.Body as AsyncIterable<
    Buffer | Uint8Array | string
  >) {
    if (typeof chunk === 'string') {
      chunks.push(Buffer.from(chunk));
      continue;
    }

    chunks.push(Buffer.from(chunk));
  }

  return {
    body: Buffer.concat(chunks),
    contentType: response.ContentType ?? 'image/png',
  } satisfies ProfileImageData;
}

export async function deleteProfileImageFromStorage(objectKey: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
    }),
  );
}
