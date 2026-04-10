import 'server-only';

import { errors, jwtVerify, SignJWT, type JWTPayload } from 'jose';

import { env } from '@/lib/env';

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

type AuthTokenType = 'access' | 'refresh';

export type AuthTokenPayload = {
  userId: string;
  email: string;
};

export type VerifiedAuthTokenPayload = {
  userId: string;
  email: string;
  tokenType: AuthTokenType;
  iat?: number;
  exp?: number;
};

export class TokenExpiredError extends Error {
  constructor(message = 'Token is expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message = 'Token is invalid') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export function isTokenExpiredError(
  error: unknown,
): error is TokenExpiredError {
  return error instanceof TokenExpiredError;
}

function normalizeVerifiedPayload(
  payload: JWTPayload,
  expectedTokenType: AuthTokenType,
): VerifiedAuthTokenPayload {
  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new InvalidTokenError('Token subject is missing');
  }

  if (typeof payload.email !== 'string' || payload.email.length === 0) {
    throw new InvalidTokenError('Token email claim is missing');
  }

  const tokenType = payload.tokenType;

  if (tokenType !== expectedTokenType) {
    throw new InvalidTokenError('Token type mismatch');
  }

  return {
    userId: payload.sub,
    email: payload.email,
    tokenType: expectedTokenType,
    iat: payload.iat,
    exp: payload.exp,
  };
}

async function verifyToken(
  token: string,
  secret: Uint8Array,
  expectedTokenType: AuthTokenType,
): Promise<VerifiedAuthTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return normalizeVerifiedPayload(payload, expectedTokenType);
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      throw new TokenExpiredError();
    }

    throw new InvalidTokenError();
  }
}

export async function signAccessToken(
  payload: AuthTokenPayload,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    tokenType: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRES_IN)
    .sign(accessSecret);
}

export async function signRefreshToken(
  payload: AuthTokenPayload,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    tokenType: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRES_IN)
    .sign(refreshSecret);
}

export async function verifyAccessToken(
  token: string,
): Promise<VerifiedAuthTokenPayload> {
  return verifyToken(token, accessSecret, 'access');
}

export async function verifyRefreshToken(
  token: string,
): Promise<VerifiedAuthTokenPayload> {
  return verifyToken(token, refreshSecret, 'refresh');
}
