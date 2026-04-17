'use client';

import { useState } from 'react';

import type { AuthUser } from '@/lib/types/auth-user';

import AccountProfileForm from '@/components/account/AccountProfileForm';
import PasswordChangeCard from '@/components/account/PasswordChangeCard';

type AccountPageClientProps = {
  user: AuthUser;
};

export default function AccountPageClient({
  user: initialUser,
}: AccountPageClientProps) {
  const [user, setUser] = useState(initialUser);

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]'>
      <AccountProfileForm user={user} onUserUpdated={setUser} />
      <PasswordChangeCard email={user.email} firstName={user.firstName} />
    </div>
  );
}
