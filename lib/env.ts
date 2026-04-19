import 'server-only';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      value =>
        value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'DATABASE_URL must be a valid MongoDB connection string',
    ),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'FIREBASE_PROJECT_ID is required for firebase-admin'),
  FIREBASE_CLIENT_EMAIL: z
    .string()
    .min(1, 'FIREBASE_CLIENT_EMAIL is required for firebase-admin'),
  FIREBASE_PRIVATE_KEY: z
    .string()
    .min(1, 'FIREBASE_PRIVATE_KEY is required for firebase-admin'),
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_API_KEY is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_APP_ID is required'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  REPLICATE_API_KEY: z.string().min(1, 'REPLICATE_API_KEY is required'),
  APP_URL: z.string().url().optional(),
  REPLICATE_WEBHOOK_SIGNING_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM: z
    .string()
    .min(1, 'RESEND_FROM is required')
    .default('Snap AI <onboarding@resend.dev>'),
  R2_S3_ENDPOINT: z
    .string()
    .url('R2_S3_ENDPOINT must be a valid URL')
    .min(1, 'R2_S3_ENDPOINT is required'),
  R2_ACCOUNT_ID: z.string().min(1, 'R2_ACCOUNT_ID is required'),
  R2_ACCOUNT_TOKEN: z.string().min(1, 'R2_ACCOUNT_TOKEN is required'),
  R2_ACCESS_ID: z.string().min(1, 'R2_ACCESS_ID is required'),
  R2_SECRET_ACCESS_KEY: z.string().min(1, 'R2_SECRET_ACCESS_KEY is required'),
  R2_BUCKET_NAME: z.string().min(1, 'R2_BUCKET_NAME is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map(issue => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');

  throw new Error(`Invalid environment variables: ${issues}`);
}

export const env = parsedEnv.data;
