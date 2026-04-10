'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/lib/store/auth-store';

type AuthBootstrapProps = {
  hasAnyAuthCookie: boolean;
  hasRefreshToken: boolean;
};

export default function AuthBootstrap({
  hasAnyAuthCookie,
  hasRefreshToken,
}: AuthBootstrapProps) {
  const bootstrapUser = useAuthStore(state => state.bootstrapUser);
  const markInitialized = useAuthStore(state => state.markInitialized);

  useEffect(() => {
    if (!hasAnyAuthCookie) {
      markInitialized();
      return;
    }

    void bootstrapUser({ refreshOn401: hasRefreshToken });
  }, [bootstrapUser, hasAnyAuthCookie, hasRefreshToken, markInitialized]);

  return null;
}
