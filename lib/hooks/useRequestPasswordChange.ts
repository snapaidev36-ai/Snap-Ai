'use client';

import { useCallback, useState } from 'react';

import { apiClient } from '@/lib/client/api';

type PasswordChangeResponse = {
  message?: string;
};

export function useRequestPasswordChange() {
  const [isSending, setIsSending] = useState(false);

  const requestPasswordChange = useCallback(async () => {
    setIsSending(true);

    try {
      const response = await apiClient<PasswordChangeResponse>(
        '/api/account/request-password-change',
        {
          method: 'POST',
        },
      );

      return response;
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    requestPasswordChange,
    isSending,
  };
}
