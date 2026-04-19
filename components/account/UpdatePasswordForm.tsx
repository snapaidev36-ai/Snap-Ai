'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { apiClient, ApiClientError } from '@/lib/client/api';
import { Eye, EyeOff, Lock } from '@/lib/icons';
import { getFirstMessage } from '@/lib/helpers';
import {
  passwordUpdateFormSchema,
  type PasswordUpdateFormInput,
} from '@/lib/validation/auth';

type UpdatePasswordFormProps = {
  token: string;
};

type UpdatePasswordResponse = {
  message?: string;
  error?: string;
  fields?: Partial<Record<'token' | 'newPassword', string[]>>;
};

export default function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordUpdateFormInput>({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const { clearErrors, setError } = form;

  function applyBackendValidationErrors(
    fields?: UpdatePasswordResponse['fields'],
  ) {
    const tokenError = getFirstMessage(fields?.token);
    if (tokenError) {
      toast.error(tokenError);
    }

    const passwordError = getFirstMessage(fields?.newPassword);
    if (passwordError) {
      setError('newPassword', { type: 'server', message: passwordError });
    }
  }

  const onSubmit = async (values: PasswordUpdateFormInput) => {
    clearErrors();
    setLoading(true);

    try {
      const response = await apiClient<UpdatePasswordResponse>(
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

      toast.success(response.message ?? 'Your password has been updated.');
      router.replace('/login?password-updated=1');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 400) {
        const body = error.details as UpdatePasswordResponse | undefined;
        applyBackendValidationErrors(body?.fields);

        if (!body?.fields?.newPassword && body?.error) {
          toast.error(body.error);
        }

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to update your password.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full shadow-lg'>
      <CardHeader>
        <CardTitle>Update password</CardTitle>
        <CardDescription>
          Choose a new password for your Snap AI account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-3 size-4 text-muted-foreground' />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className='bg-muted/50 pl-10 pr-12'
                        placeholder='••••••••'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(value => !value)}
                        className='absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground'
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }>
                        {showPassword ? (
                          <EyeOff className='size-4' />
                        ) : (
                          <Eye className='size-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className='bg-muted/50'
                      placeholder='••••••••'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Updating password...' : 'Update password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
