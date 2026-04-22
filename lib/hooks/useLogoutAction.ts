'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/client/api';
import { useAuthStore } from '@/lib/store/auth-store';

export function useLogoutAction() {
  const router = useRouter();
  const clearUser = useAuthStore(state => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
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
  }, [clearUser, router]);

  return {
    handleLogout,
    isLoggingOut,
    errorMessage,
  };
}
