import type { Metadata } from 'next';

import RegisterForm from '@/components/auth/Register';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Create an account',
  description:
    'Create your Snap AI account and start generating images in a few minutes.',
  path: '/register',
  noindex: true,
  keywords: ['register', 'create account', 'sign up'],
});

export default function Register() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
