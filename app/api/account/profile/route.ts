import { Buffer } from 'node:buffer';

import { type NextRequest, NextResponse } from 'next/server';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { getProfileImageUrl, toAuthUser } from '@/lib/auth/user-profile';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import {
  deleteProfileImageFromStorage,
  uploadProfileImageFromBuffer,
} from '@/lib/server/profile-images';
import { updateProfileSchema } from '@/lib/validation/auth';

export const runtime = 'nodejs';

const PROFILE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function buildValidationError(message: string, field: string) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      fields: {
        [field]: [message],
      },
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  const response = NextResponse.json({
    user: toAuthUser(authResult.user),
  });

  response.headers.set('Cache-Control', 'no-store');

  return response;
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError('Invalid form data', 400);
  }

  const parsed = updateProfileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  });

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const imageValue = formData.get('profileImage');
  let uploadedProfileImageKey: string | null = null;

  if (imageValue instanceof File && imageValue.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(imageValue.type)) {
      return buildValidationError(
        'Upload a JPG, PNG, or WebP image.',
        'profileImage',
      );
    }

    if (imageValue.size > PROFILE_IMAGE_MAX_SIZE_BYTES) {
      return buildValidationError(
        'Profile image must be 5MB or smaller.',
        'profileImage',
      );
    }

    const body = Buffer.from(await imageValue.arrayBuffer());
    const uploadedProfileImage = await uploadProfileImageFromBuffer({
      userId: authResult.user.id,
      body,
      contentType: imageValue.type,
    });

    uploadedProfileImageKey = uploadedProfileImage.objectKey;
  }

  const updatedUser = await prisma.user.update({
    where: { id: authResult.user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      ...(uploadedProfileImageKey
        ? { profileImageKey: uploadedProfileImageKey }
        : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      authProvider: true,
      credits: true,
      createdAt: true,
      profileImageKey: true,
    },
  });

  if (uploadedProfileImageKey && authResult.user.profileImageKey) {
    void deleteProfileImageFromStorage(authResult.user.profileImageKey).catch(
      () => undefined,
    );
  }

  const response = NextResponse.json({
    message: 'Profile updated successfully',
    user: toAuthUser(updatedUser),
    profileImageUrl: getProfileImageUrl(updatedUser.profileImageKey),
  });

  response.headers.set('Cache-Control', 'no-store');

  return response;
}
