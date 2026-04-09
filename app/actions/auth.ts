'use server';

import { cookies, headers } from 'next/headers';

import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/lib/validation/auth';

type ApiErrorPayload = {
  error?: string;
  fields?: Record<string, string[] | undefined>;
};

type ActionResult<T> =
  | {
      ok: true;
      data: T;
      status: number;
    }
  | {
      ok: false;
      error: string;
      status: number;
      fields?: Record<string, string[] | undefined>;
    };

function getSetCookieHeaders(response: Response): string[] {
  const headersWithSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithSetCookie.getSetCookie === 'function') {
    return headersWithSetCookie.getSetCookie();
  }

  const singleSetCookie = response.headers.get('set-cookie');
  return singleSetCookie ? [singleSetCookie] : [];
}

async function mirrorSetCookieHeaders(response: Response) {
  const setCookieHeaders = getSetCookieHeaders(response);

  if (setCookieHeaders.length === 0) {
    return;
  }

  const cookieStore = await cookies();

  for (const setCookie of setCookieHeaders) {
    const [cookiePair, ...rawAttributes] = setCookie
      .split(';')
      .map(part => part.trim());

    const separatorIndex = cookiePair.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const name = cookiePair.slice(0, separatorIndex);
    const value = cookiePair.slice(separatorIndex + 1);

    const options: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'lax' | 'strict' | 'none';
      path?: string;
      maxAge?: number;
      expires?: Date;
    } = {};

    for (const attribute of rawAttributes) {
      const [rawKey, ...rawValueParts] = attribute.split('=');
      const key = rawKey.toLowerCase();
      const rawValue = rawValueParts.join('=').trim();

      if (key === 'httponly') {
        options.httpOnly = true;
      }

      if (key === 'secure') {
        options.secure = true;
      }

      if (key === 'path' && rawValue) {
        options.path = rawValue;
      }

      if (key === 'samesite' && rawValue) {
        const normalized = rawValue.toLowerCase();
        if (
          normalized === 'lax' ||
          normalized === 'strict' ||
          normalized === 'none'
        ) {
          options.sameSite = normalized;
        }
      }

      if (key === 'max-age' && rawValue) {
        const parsedMaxAge = Number(rawValue);
        if (!Number.isNaN(parsedMaxAge)) {
          options.maxAge = parsedMaxAge;
        }
      }

      if (key === 'expires' && rawValue) {
        const expiresDate = new Date(rawValue);
        if (!Number.isNaN(expiresDate.getTime())) {
          options.expires = expiresDate;
        }
      }
    }

    cookieStore.set(name, value, options);
  }
}

async function getBaseUrl() {
  const headerStore = await headers();
  const host =
    headerStore.get('x-forwarded-host') ??
    headerStore.get('host') ??
    process.env.VERCEL_URL;

  if (!host) {
    throw new Error('Unable to resolve host for auth server action request');
  }

  const protocol =
    headerStore.get('x-forwarded-proto') ??
    (host.includes('localhost') ? 'http' : 'https');

  if (host.startsWith('http://') || host.startsWith('https://')) {
    return host;
  }

  return `${protocol}://${host}`;
}

async function callAuthRoute<T>(
  pathname: string,
  init: RequestInit,
): Promise<ActionResult<T>> {
  const baseUrl = await getBaseUrl();
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie');

  const requestHeaders = new Headers(init.headers);
  if (cookieHeader) {
    requestHeaders.set('cookie', cookieHeader);
  }

  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: requestHeaders,
    cache: 'no-store',
  });

  await mirrorSetCookieHeaders(response);

  const payload = (await response.json().catch(() => ({}))) as T &
    ApiErrorPayload;

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

export async function registerAction(payload: RegisterInput) {
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: 'Validation failed',
      fields: parsed.error.flatten().fieldErrors,
    } satisfies ActionResult<never>;
  }

  return callAuthRoute<{
    message: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      credits: number;
      createdAt: string;
    };
  }>('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });
}

export async function loginAction(payload: LoginInput) {
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: 'Validation failed',
      fields: parsed.error.flatten().fieldErrors,
    } satisfies ActionResult<never>;
  }

  return callAuthRoute<{
    message: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      credits: number;
      createdAt: string;
    };
  }>('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });
}

export async function refreshSessionAction() {
  return callAuthRoute<{ message: string }>('/api/auth/refresh', {
    method: 'POST',
  });
}

export async function logoutAction() {
  return callAuthRoute<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  });
}
