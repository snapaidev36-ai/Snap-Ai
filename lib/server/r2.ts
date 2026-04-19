import 'server-only';

import { S3Client } from '@aws-sdk/client-s3';

import { env } from '@/lib/env';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.R2_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.R2_ACCESS_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});
