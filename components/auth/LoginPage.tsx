'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/lib/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/dashboard');
    }
  }, [initialized, router, user]);

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
