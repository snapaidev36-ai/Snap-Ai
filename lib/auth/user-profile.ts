import type { AuthUser } from '@/lib/types/auth-user';

export const PROFILE_IMAGE_ROUTE = '/api/account/profile-image';

export function getProfileImageUrl(profileImageKey?: string | null) {
  return profileImageKey ? PROFILE_IMAGE_ROUTE : null;
}

export function toAuthUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: string;
  credits: number;
  createdAt: Date;
  profileImageKey?: string | null;
}): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    authProvider: user.authProvider,
    profileImageUrl: getProfileImageUrl(user.profileImageKey),
    credits: user.credits,
    createdAt: user.createdAt.toISOString(),
  };
}
