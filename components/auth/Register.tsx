'use client';

import Image from 'next/image';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Mail, Lock, User } from 'lucide-react';

// Zod Schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        return;
      }
      console.log('Valid Data:', value);
    },
  });

  return (
    <div className='min-h-dvh flex items-center justify-center'>
      <CardContent className='px-1 min-h-dvh grid md:grid-cols-2 w-full'>
        {/* LEFT IMAGE */}
        <div className='relative rounded-4xl hidden md:block'>
          <Image
            src='/login-img.png'
            alt='Register'
            fill
            className='object-cover rounded-4xl'
          />
        </div>

        {/* RIGHT FORM */}
        <div className='p-8 md:p-10 bg-white'>
          <h2 className='text-2xl font-bold mb-2'>Create your account!</h2>
          <p className='text-gray-500 mb-6'>
            Create your account and start your journey today!
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className='space-y-8'>
            {/* FIRST + LAST NAME */}
            <div className='grid grid-cols-2 gap-4'>
              <form.Field name='firstName'>
                {field => (
                  <div>
                    <label className='text-sm font-medium mb-1 block'>
                      First Name
                    </label>
                    <div className='relative'>
                      <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                      <Input
                        placeholder='First Name'
                        className='pl-10 rounded-4xl bg-gray-100 h-12'
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name='lastName'>
                {field => (
                  <div>
                    <label className='text-sm font-medium mb-1 block'>
                      Last Name
                    </label>
                    <div className='relative'>
                      <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                      <Input
                        placeholder='Last Name'
                        className='pl-10 rounded-4xl bg-gray-100 h-12'
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            {/* EMAIL */}
            <form.Field name='email'>
              {field => (
                <div>
                  <label className='text-sm font-medium mb-1 block'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      type='email'
                      placeholder='Email'
                      className='pl-10 rounded-4xl bg-gray-100 h-12'
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </form.Field>

            {/* PASSWORD */}
            <form.Field name='password'>
              {field => (
                <div>
                  <label className='text-sm font-medium mb-1 block'>
                    Password
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      type='password'
                      placeholder='Password'
                      className='pl-10 rounded-4xl bg-gray-100 h-12'
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </form.Field>

            {/* SIGN UP BUTTON */}
            <Button
              type='submit'
              className='w-full h-12 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-full'>
              Sign up
            </Button>

            {/* DIVIDER */}
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <div className='flex-1 h-px bg-gray-200' />
              OR
              <div className='flex-1 h-px bg-gray-200' />
            </div>

            {/* GOOGLE BUTTON */}
            <Button
              type='button'
              variant='outline'
              className='w-full flex items-center gap-2 h-12 rounded-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 48 48'
                className='h-5 w-5'>
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
              Continue with Google
            </Button>

            <p className='text-sm text-center text-gray-500'>
              Already have an account?{' '}
              <span className='font-medium text-black cursor-pointer'>
                Sign in
              </span>
            </p>
          </form>
        </div>
      </CardContent>
    </div>
  );
}
