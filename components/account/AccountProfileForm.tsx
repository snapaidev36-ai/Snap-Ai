'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Upload } from '@/lib/icons';
import { toast } from '@/components/ui/sonner';
import { getFirstMessage, getInitials } from '@/lib/helpers';
import { useAccountProfileMutation } from '@/lib/hooks/useAccountProfileMutation';
import { useAuthStore } from '@/lib/store/auth-store';
import type { AuthUser } from '@/lib/types/auth-user';
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from '@/lib/validation/auth';

type AccountProfileFormProps = {
  user: AuthUser;
  onUserUpdated: (user: AuthUser) => void;
};

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export default function AccountProfileForm({
  user,
  onUserUpdated,
}: AccountProfileFormProps) {
  const setStoreUser = useAuthStore(state => state.setUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState<string | null>(
    null,
  );
  const { updateProfile, isUpdating } = useAccountProfileMutation();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
    mode: 'onTouched',
  });

  const { clearErrors, setError, reset } = form;

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [reset, user.firstName, user.lastName]);

  useEffect(() => {
    if (!previewUrl) {
      return undefined;
    }

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function applyBackendValidationErrors(
    fields?: Partial<
      Record<'firstName' | 'lastName' | 'profileImage', string[]>
    >,
  ) {
    const firstNameError = getFirstMessage(fields?.firstName);
    if (firstNameError) {
      setError('firstName', { type: 'server', message: firstNameError });
    }

    const lastNameError = getFirstMessage(fields?.lastName);
    if (lastNameError) {
      setError('lastName', { type: 'server', message: lastNameError });
    }

    const imageError = getFirstMessage(fields?.profileImage);
    if (imageError) {
      setProfileImageError(imageError);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setProfileImageError(null);

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(file.type)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setProfileImageError('Upload a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setProfileImageError('Profile image must be 5MB or smaller.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function resetSelectedFile() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileInputKey(value => value + 1);
  }

  const onSubmit = async (values: UpdateProfileInput) => {
    clearErrors();
    setProfileImageError(null);

    try {
      const response = await updateProfile(values, selectedFile);
      const body = response.body;

      if (!response.ok) {
        if (response.status === 400 && body?.fields) {
          applyBackendValidationErrors(body.fields);
          return;
        }

        toast.error(
          body?.error ?? body?.message ?? 'Unable to update your profile.',
        );
        return;
      }

      if (body?.user) {
        onUserUpdated(body.user);
        setStoreUser(body.user);
      }

      resetSelectedFile();

      toast.success(body?.message ?? 'Profile updated successfully.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to update your profile.',
      );
    }
  };

  const avatarSrc = previewUrl ?? user.profileImageUrl ?? undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>
          Update your name and profile image. Changes appear across the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
              <Avatar className='size-20 border border-border/70 shadow-sm'>
                {avatarSrc ? (
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : null}
                <AvatarFallback className='text-lg'>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className='space-y-3'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Profile image</p>
                  <p className='text-muted-foreground text-sm'>
                    JPG, PNG, or WebP up to 5MB.
                  </p>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload className='mr-2 size-4' />
                    Choose image
                  </Button>
                  {selectedFile ? (
                    <span className='text-muted-foreground text-sm'>
                      {selectedFile.name}
                    </span>
                  ) : null}
                </div>

                <input
                  key={fileInputKey}
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  className='hidden'
                  onChange={handleFileChange}
                />

                {profileImageError ? (
                  <p className='text-sm text-destructive'>
                    {profileImageError}
                  </p>
                ) : null}
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Sarah'
                        className='bg-muted/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Vaughn'
                        className='bg-muted/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='rounded-2xl border border-border/60 bg-muted/20 px-4 py-3'>
              <p className='text-muted-foreground text-xs uppercase tracking-[0.16em]'>
                Email
              </p>
              <p className='mt-1 text-sm font-medium'>{user.email}</p>
            </div>

            <Button type='submit' disabled={isUpdating}>
              {isUpdating ? 'Saving profile...' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
