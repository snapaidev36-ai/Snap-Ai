import 'server-only';

import { headers } from 'next/headers';

import { env } from '@/lib/env';

export async function getSiteUrl() {
  if (env.APP_URL) {
    return env.APP_URL;
  }

  const headerStore = await headers();
  const host =
    headerStore.get('x-forwarded-host') ??
    headerStore.get('host') ??
    process.env.VERCEL_URL;

  if (!host) {
    throw new Error('Unable to resolve site URL');
  }

  const protocol =
    headerStore.get('x-forwarded-proto') ??
    (host.includes('localhost') ? 'http' : 'https');

  if (host.startsWith('http://') || host.startsWith('https://')) {
    return host;
  }

  return `${protocol}://${host}`;
}
