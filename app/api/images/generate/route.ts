import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { env } from '@/lib/env';
import { jsonError, jsonValidationError } from '@/lib/http';
import { queueUserImageGeneration } from '@/lib/services/image-generation';
import { generateImageSchema } from '@/lib/validation/generation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = generateImageSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const authResult = await requireCurrentUser(request);
  if ('error' in authResult) {
    return authResult.error;
  }

  try {
    const result = await queueUserImageGeneration({
      userId: authResult.user.id,
      prompt: parsed.data.prompt,
      aspectRatio: parsed.data.aspectRatio,
      style: parsed.data.style,
      webhookBaseUrl: env.APP_URL ?? request.nextUrl.origin,
    });

    return NextResponse.json(
      {
        message:
          'Image generation is in progress. Your image will appear here when it is ready.',
        status: result.status,
        predictionId: result.predictionId,
        user: result.user,
        usage: result.usage,
        imageUrl: result.imageUrl,
      },
      { status: 202, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Generation failed';

    if (message === 'Not enough credits') {
      return jsonError('Not enough credits to generate an image', 402);
    }

    return jsonError(message, 500);
  }
}
