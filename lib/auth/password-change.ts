import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

export const PASSWORD_CHANGE_TOKEN_TTL_MS = 15 * 60 * 1000;

export function createPasswordChangeToken() {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashPasswordChangeToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_CHANGE_TOKEN_TTL_MS);

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

export function hashPasswordChangeToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
