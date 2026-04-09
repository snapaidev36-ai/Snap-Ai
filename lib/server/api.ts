import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';

type ServerApiErrorPayload = {
  error?: string;
  fields?: Record<string, string[] | undefined>;
};

export type ServerApiResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status: number;
      error: string;
      fields?: Record<string, string[] | undefined>;
    };

async function resolveBaseUrl() {
  const headerStore = await headers();
  const host =
    headerStore.get('x-forwarded-host') ??
    headerStore.get('host') ??
    process.env.VERCEL_URL;

  if (!host) {
    throw new Error('Unable to resolve host for server route call');
  }

  const protocol =
    headerStore.get('x-forwarded-proto') ??
    (host.includes('localhost') ? 'http' : 'https');

  if (host.startsWith('http://') || host.startsWith('https://')) {
    return host;
  }

  return `${protocol}://${host}`;
}

export async function serverRouteFetch<T>(
  pathname: string,
  init: RequestInit = {},
): Promise<ServerApiResult<T>> {
  noStore();

  const baseUrl = await resolveBaseUrl();
  const headerStore = await headers();
  const requestHeaders = new Headers(init.headers);
  const cookieHeader = headerStore.get('cookie');

  if (cookieHeader) {
    requestHeaders.set('cookie', cookieHeader);
  }

  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: requestHeaders,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => ({}))) as T &
    ServerApiErrorPayload;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload.error ?? 'Request failed',
      fields: payload.fields,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload,
  };
}
