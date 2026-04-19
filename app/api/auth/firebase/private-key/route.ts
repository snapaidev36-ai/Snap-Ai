import { Buffer } from 'node:buffer';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse, type NextRequest } from 'next/server';

import { env } from '@/lib/env';
import { jsonError } from '@/lib/http';
import { r2Client } from '@/lib/server/r2';

const FIREBASE_PRIVATE_KEY_OBJECT_KEY = 'firebase-private-key.pem';

export const runtime = 'nodejs';

async function readObjectAsText(key: string) {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error('Firebase private key file not found');
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

  return Buffer.concat(chunks).toString('utf8');
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey || apiKey !== env.FIREBASE_PRIVATE_KEY_API_KEY_HASH) {
    return jsonError('Unauthorized', 401);
  }

  try {
    const privateKey = await readObjectAsText(FIREBASE_PRIVATE_KEY_OBJECT_KEY);

    const response = NextResponse.json({
      privateKey,
    });

    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch {
    return jsonError('Firebase private key not found', 404);
  }
}
