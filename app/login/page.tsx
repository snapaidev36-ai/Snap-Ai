import type { Metadata } from 'next';

import LoginPage from '@/components/auth/LoginPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sign in',
  description:
    'Sign in to Snap AI to continue generating images and managing your account.',
  path: '/login',
  noindex: true,
  keywords: ['login', 'sign in', 'account access'],
});

export default function Page() {
  return <LoginPage />;
}
