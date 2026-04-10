import { NextResponse } from 'next/server';

import { clearAuthCookies } from '@/lib/auth/cookies';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });

  clearAuthCookies(response);
  response.headers.set('Cache-Control', 'no-store');

  return response;
}
