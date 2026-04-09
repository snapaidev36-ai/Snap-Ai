import {
  signAccessToken,
  type AuthTokenPayload,
  verifyRefreshToken,
} from '@/lib/auth/tokens';

export async function issueAccessTokenFromRefresh(
  refreshToken: string,
): Promise<string> {
  const refreshPayload = await verifyRefreshToken(refreshToken);

  const accessPayload: AuthTokenPayload = {
    userId: refreshPayload.userId,
    email: refreshPayload.email,
  };

  return signAccessToken(accessPayload);
}
