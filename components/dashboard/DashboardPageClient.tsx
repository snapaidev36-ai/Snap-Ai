'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import GreetingHero from '@/components/dashboard/GreetingHero';
import PromptComposer from '@/components/dashboard/PromptComposer';
import { apiClient } from '@/lib/client/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { pageContainer } from '@/lib/motion/variants';

type DashboardPageClientProps = {
  initialSidebarCollapsed: boolean;
  recentPrompts?: string[];
  children?: ReactNode;
  contentClassName?: string;
};

export default function DashboardPageClient({
  initialSidebarCollapsed,
  recentPrompts = [],
  children,
  contentClassName,
}: DashboardPageClientProps) {
  const router = useRouter();
  const clearUser = useAuthStore(state => state.clearUser);
  const prefersReducedMotion = useReducedMotion();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setErrorMessage(null);

    try {
      await apiClient<{ message: string }>('/api/auth/logout', {
        method: 'POST',
        skipAuthRefresh: true,
      });

      clearUser();
      router.replace('/login');
    } catch {
      setErrorMessage('Unable to logout right now. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className='h-dvh overflow-hidden bg-background'>
      <div className='flex h-dvh'>
        <DashboardSidebar initialCollapsed={initialSidebarCollapsed} />

        <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <DashboardHeader
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />

          <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6'>
            <motion.div
              className={`mx-auto flex w-full flex-col gap-5 sm:gap-6 ${contentClassName ?? 'max-w-6xl'}`}
              variants={prefersReducedMotion ? undefined : pageContainer}
              initial={prefersReducedMotion ? undefined : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'show'}>
              {errorMessage ? (
                <p
                  className='rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive'
                  role='alert'>
                  {errorMessage}
                </p>
              ) : null}

              {children ?? (
                <>
                  <GreetingHero />
                  <PromptComposer recentPrompts={recentPrompts} />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
