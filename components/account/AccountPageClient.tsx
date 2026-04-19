'use client';

import { useState } from 'react';

import type { AuthUser } from '@/lib/types/auth-user';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AccountProfileForm from '@/components/account/AccountProfileForm';
import PasswordChangeCard from '@/components/account/PasswordChangeCard';

type AccountPageClientProps = {
  user: AuthUser;
};

export default function AccountPageClient({
  user: initialUser,
}: AccountPageClientProps) {
  const [user, setUser] = useState(initialUser);
  const canChangePassword = user.authProvider === 'email';

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]'>
      <AccountProfileForm user={user} onUserUpdated={setUser} />
      {canChangePassword ? (
        <PasswordChangeCard email={user.email} firstName={user.firstName} />
      ) : (
        <Card className='overflow-hidden border-emerald-200/70 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(130,255,115,0.08))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-emerald-500/30 dark:bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.16),transparent_30%),linear-gradient(135deg,rgba(19,19,19,0.96),rgba(130,255,115,0.07))]'>
          <CardHeader>
            <CardTitle>Password managed by Google</CardTitle>
            <CardDescription>
              This account was created with Google sign-in, so Snap AI cannot
              send a password update email. Use Google to sign in, or add an
              email/password account if you want to manage a local password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Your profile details can still be updated normally.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
