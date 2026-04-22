'use client';

import { useCallback, useState } from 'react';

import { cleanString } from '@/lib/helpers';
import type { AuthUser } from '@/lib/types/auth-user';
import type { UpdateProfileInput } from '@/lib/validation/auth';

export type AccountProfileResponse = {
  message?: string;
  error?: string;
  fields?: Partial<Record<'firstName' | 'lastName' | 'profileImage', string[]>>;
  user?: AuthUser;
};

export function useAccountProfileMutation() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = useCallback(
    async (values: UpdateProfileInput, selectedFile: File | null) => {
      setIsUpdating(true);

      try {
        const formData = new FormData();
        formData.append('firstName', cleanString(values.firstName));
        formData.append('lastName', cleanString(values.lastName));

        if (selectedFile) {
          formData.append('profileImage', selectedFile);
        }

        const response = await fetch('/api/account/profile', {
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        });

        const body = (await response
          .json()
          .catch(() => null)) as AccountProfileResponse | null;

        return {
          ok: response.ok,
          status: response.status,
          body,
        };
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  return {
    updateProfile,
    isUpdating,
  };
}
