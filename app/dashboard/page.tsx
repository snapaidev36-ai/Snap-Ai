'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/client/api';
import { useAuthStore } from '@/lib/store/auth-store';

export default function DashboardPage() {
  const router = useRouter();
  const clearUser = useAuthStore(state => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setErrorMessage(null);

    try {
      await apiClient<{ message: string }>('/api/auth/logout', {
        method: 'POST',
        skipAuthRefresh: true,
      });

      clearUser();
      router.replace('/login');
    } catch {
      setErrorMessage('Unable to logout right now. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-12'>
      <div className='mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='text-3xl font-semibold text-slate-900'>Dashboard</h1>
        <p className='mt-3 text-slate-600'>
          You are signed in successfully. This page is protected by middleware.
        </p>

        <Button
          className='mt-6'
          variant='outline'
          onClick={handleLogout}
          disabled={isLoggingOut}>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>

        {errorMessage ? (
          <p className='mt-3 text-sm text-red-600' role='alert'>
            {errorMessage}
          </p>
        ) : null}
      </div>
    </main>
  );
}
