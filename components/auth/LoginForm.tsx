'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Eye, EyeOff, Lock, Mail } from '@/lib/icons';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';
import { useLoginFormActions } from '@/lib/hooks/useLoginFormActions';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const { clearErrors, setError } = form;
  const { handleLoginSubmit, handleGoogleSignIn, loading, googleLoading } =
    useLoginFormActions({ clearErrors, setError });

  return (
    <div className='w-full'>
      <div className='flex items-center gap-2 mb-2'>
        <Image src='/logo.png' alt='Logo' width={36} height={36} />
        <h2 className='text-3xl font-bold text-foreground'>Welcome back</h2>
      </div>

      <p className='text-muted-foreground mb-8'>
        Sign in to continue to your dashboard
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginSubmit)}
          className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      className='pl-10 bg-muted/50'
                      placeholder='you@company.com'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className='pl-10 pr-12 bg-muted/50'
                      placeholder='••••••••'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(v => !v)}
                      className='absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }>
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='mt-6 w-full'
            disabled={loading || googleLoading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className='flex items-center gap-3 my-3'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-xs text-muted-foreground'>or</span>
            <div className='h-px flex-1 bg-border' />
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 48 48'
              className='mr-2 h-4 w-4'>
              <path
                fill='#FFC107'
                d='M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.221 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.269 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
              />
              <path
                fill='#FF3D00'
                d='M6.306 14.691l6.571 4.819C14.655 16.108 19.002 12 24 12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.269 4 24 4 16.318 4 9.656 8.337 6.306 14.691z'
              />
              <path
                fill='#4CAF50'
                d='M24 44c5.166 0 9.86-1.977 13.409-5.193l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.201 0-9.626-3.325-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
              />
              <path
                fill='#1976D2'
                d='M43.611 20.083H42V20H24v8h11.303c-1.088 3.015-3.309 5.487-6.084 6.969l.004-.002 6.19 5.238C33.985 41.091 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
              />
            </svg>
            <span>
              {googleLoading
                ? 'Signing in with Google...'
                : 'Sign in with Google'}
            </span>
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-semibold text-primary hover:underline'>
              Create one
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
