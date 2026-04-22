'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormSetError } from 'react-hook-form';

import { signInWithGoogleUsingFirebase } from '@/lib/client/firebase';
import { getErrorMessage, getFirstMessage } from '@/lib/helpers';
import type { AuthUser } from '@/lib/types/auth-user';
import { useAuthStore } from '@/lib/store/auth-store';
import type { LoginInput } from '@/lib/validation/auth';
import { toast } from '@/components/ui/sonner';

type BackendFieldErrors = Partial<Record<'email' | 'password', string[]>>;

type LoginErrorResponse = {
  error?: string;
  message?: string;
  fields?: BackendFieldErrors;
};

type LoginResponseBody = LoginErrorResponse & {
  user?: AuthUser;
};

type UseLoginFormActionsProps = {
  clearErrors: () => void;
  setError: UseFormSetError<LoginInput>;
};

export function useLoginFormActions({
  clearErrors,
  setError,
}: UseLoginFormActionsProps) {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const applyBackendValidationErrors = useCallback(
    (fields: BackendFieldErrors) => {
      const emailError = getFirstMessage(fields.email);
      if (emailError) {
        setError('email', { type: 'server', message: emailError });
      }

      const passwordError = getFirstMessage(fields.password);
      if (passwordError) {
        setError('password', { type: 'server', message: passwordError });
      }
    },
    [setError],
  );

  const handleLoginSubmit = useCallback(
    async (values: LoginInput) => {
      clearErrors();
      setLoading(true);

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const body = (await response
          .json()
          .catch(() => null)) as LoginResponseBody | null;

        if (!response.ok) {
          if (response.status === 400 && body?.fields) {
            applyBackendValidationErrors(body.fields);
            return;
          }

          toast.error(
            body?.error ??
              body?.message ??
              'Unable to sign in. Please try again.',
          );
          return;
        }

        if (body?.user) {
          setUser(body.user);
        }

        router.replace('/dashboard');
      } catch {
        toast.error('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    },
    [applyBackendValidationErrors, clearErrors, router, setUser],
  );

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);

    try {
      const response = await signInWithGoogleUsingFirebase();
      setUser(response.user);
      router.replace(response.redirectTo || '/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  }, [router, setUser]);

  return {
    handleLoginSubmit,
    handleGoogleSignIn,
    loading,
    googleLoading,
  };
}
