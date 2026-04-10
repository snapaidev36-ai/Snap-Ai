'use client';

import { useEffect } from 'react';

import { AUTH_HINT_COOKIE_NAME } from '@/lib/auth/cookies';
import { useAuthStore } from '@/lib/store/auth-store';

function hasAuthHintCookie() {
  return document.cookie
    .split(';')
    .some(cookie => cookie.trim() === `${AUTH_HINT_COOKIE_NAME}=1`);
}

export default function AuthBootstrap() {
  const bootstrapUser = useAuthStore(state => state.bootstrapUser);
  const markInitialized = useAuthStore(state => state.markInitialized);

  useEffect(() => {
    if (!hasAuthHintCookie()) {
      markInitialized();
      return;
    }

    void bootstrapUser();
  }, [bootstrapUser, markInitialized]);

  return null;
}
