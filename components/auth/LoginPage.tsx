'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/auth-store';

function subscribe() {
  return () => {};
}

function getClientSnapshot(verified: boolean) {
  if (!verified) {
    return false;
  }

  try {
    return (
      window.localStorage.getItem('snap-ai-email-verified-notice-seen') !== '1'
    );
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const registered = searchParams.get('registered') === '1';
  const verified = searchParams.get('verified') === '1';
  const showVerificationNotice = useSyncExternalStore(
    subscribe,
    () => getClientSnapshot(verified),
    getServerSnapshot,
  );

  useEffect(() => {
    if (!verified) {
      return;
    }

    try {
      if (
        window.localStorage.getItem('snap-ai-email-verified-notice-seen') !==
        '1'
      ) {
        window.localStorage.setItem('snap-ai-email-verified-notice-seen', '1');
      }
    } catch {
      // Ignore storage failures; the notice still renders for this visit.
    }
  }, [verified]);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/dashboard');
    }
  }, [initialized, router, user]);

  return (
    <AuthShell>
      <div className='space-y-4'>
        {registered || showVerificationNotice ? (
          <Card
            className={
              verified
                ? 'w-full overflow-hidden border-emerald-200/70 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(130,255,115,0.08))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-emerald-500/30 dark:bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.16),transparent_30%),linear-gradient(135deg,rgba(19,19,19,0.96),rgba(130,255,115,0.07))]'
                : 'w-full border-border/60 bg-background/95 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm'
            }>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                {verified ? 'Email verified' : 'Check your inbox'}
              </CardTitle>
              <CardDescription>
                {verified
                  ? 'Your email address is verified. You can sign in now.'
                  : 'We sent you a verification email. Open it to activate your account.'}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <Card className='w-full border-border/60 bg-background/95 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm'>
          <CardContent className='p-4 sm:p-6'>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
