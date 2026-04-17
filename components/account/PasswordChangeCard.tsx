'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiClient } from '@/lib/client/api';
import { toast } from '@/components/ui/sonner';

type PasswordChangeCardProps = {
  email: string;
  firstName: string;
};

type PasswordChangeResponse = {
  message?: string;
};

export default function PasswordChangeCard({
  email,
  firstName,
}: PasswordChangeCardProps) {
  const [loading, setLoading] = useState(false);

  const handleRequestPasswordChange = async () => {
    setLoading(true);

    try {
      const response = await apiClient<PasswordChangeResponse>(
        '/api/account/request-password-change',
        {
          method: 'POST',
        },
      );

      toast.success(
        response.message ??
          `We sent a password update link to ${email}. Check your inbox to continue.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to send the password update email.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update password</CardTitle>
        <CardDescription>
          We&apos;ll email {firstName} at {email} with a secure link to confirm
          the change.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
          The link opens the update password page and expires shortly after it
          is sent.
        </div>

        <Button
          type='button'
          className='w-full'
          onClick={handleRequestPasswordChange}
          disabled={loading}>
          {loading ? 'Sending email...' : 'Send password update email'}
        </Button>
      </CardContent>
    </Card>
  );
}
