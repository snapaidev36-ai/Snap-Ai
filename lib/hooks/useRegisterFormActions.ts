'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormSetError } from 'react-hook-form';

import { signInWithGoogleUsingFirebase } from '@/lib/client/firebase';
import { cleanString, getErrorMessage, getFirstMessage } from '@/lib/helpers';
import type { AuthUser } from '@/lib/types/auth-user';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/components/ui/sonner';

type BackendFieldErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'password', string[]>
>;

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type RegisterErrorResponse = {
  error?: string;
  message?: string;
  fields?: BackendFieldErrors;
  user?: AuthUser;
};

type UseRegisterFormActionsProps = {
  clearErrors: () => void;
  setError: UseFormSetError<RegisterFormValues>;
};

export function useRegisterFormActions({
  clearErrors,
  setError,
}: UseRegisterFormActionsProps) {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const applyBackendValidationErrors = useCallback(
    (fields: BackendFieldErrors) => {
      const nameError =
        getFirstMessage(fields.firstName) ?? getFirstMessage(fields.lastName);

      if (nameError) {
        setError('name', { type: 'server', message: nameError });
      }

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

  const handleRegisterSubmit = useCallback(
    async (values: RegisterFormValues) => {
      clearErrors();
      setLoading(true);

      try {
        const parts = cleanString(values.name).split(/\s+/).filter(Boolean);
        const firstName = parts.shift() || '';
        const lastName = parts.length ? parts.join(' ') : firstName;
        const payload = {
          firstName,
          lastName,
          email: values.email,
          password: values.password,
        };

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const body = (await response
          .json()
          .catch(() => null)) as RegisterErrorResponse | null;

        if (!response.ok) {
          if (response.status === 400 && body?.fields) {
            applyBackendValidationErrors(body.fields);
            return;
          }

          toast.error(
            body?.error ??
              body?.message ??
              'Registration failed. Please try again.',
          );
          return;
        }

        router.push('/login?registered=1');
      } catch {
        toast.error('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    },
    [applyBackendValidationErrors, clearErrors, router],
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
    handleRegisterSubmit,
    handleGoogleSignIn,
    loading,
    googleLoading,
  };
}
