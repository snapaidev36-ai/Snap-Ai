'use client';

import { useCallback, useState } from 'react';

import { apiClient } from '@/lib/client/api';
import type { PasswordUpdateFormInput } from '@/lib/validation/auth';

type UpdatePasswordResponse = {
  message?: string;
  error?: string;
  fields?: Partial<Record<'token' | 'newPassword', string[]>>;
};

export function useUpdatePasswordMutation(token: string) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePassword = useCallback(
    async (values: PasswordUpdateFormInput) => {
      setIsUpdating(true);

      try {
        return await apiClient<UpdatePasswordResponse>(
          '/api/auth/update-password',
          {
            method: 'POST',
            body: {
              token,
              newPassword: values.newPassword,
            },
            skipAuthRefresh: true,
          },
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [token],
  );

  return {
    updatePassword,
    isUpdating,
  };
}
