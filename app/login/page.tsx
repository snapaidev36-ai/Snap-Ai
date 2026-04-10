'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { signInWithGoogleUsingFirebase } from '@/lib/client/firebase';
import { useAuthStore } from '@/lib/store/auth-store';

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Unable to sign in with Google. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const setUser = useAuthStore(state => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/dashboard');
    }
  }, [initialized, router, user]);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await signInWithGoogleUsingFirebase();
      setUser(response.user);
      router.replace(response.redirectTo || '/dashboard');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='min-h-dvh bg-slate-50 px-4 py-12'>
      <div className='mx-auto flex min-h-[70dvh] w-full max-w-md items-center justify-center'>
        <div className='w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-2xl font-semibold text-slate-900'>Login</h1>
          <p className='mt-2 text-sm text-slate-600'>
            Sign in with Google to continue to your dashboard.
          </p>

          <Button
            className='mt-6 w-full'
            onClick={handleGoogleSignIn}
            disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          {errorMessage ? (
            <p className='mt-3 text-sm text-red-600' role='alert'>
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
