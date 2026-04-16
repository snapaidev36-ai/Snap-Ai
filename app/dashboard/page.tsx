import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { getCurrentUserFromCookies } from '@/lib/auth/current-user';
import { listLatestUserPrompts } from '@/lib/services/usage-history';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );
  const currentUser = await getCurrentUserFromCookies(cookieStore);

  if (!currentUser) {
    redirect('/login');
  }

  const recentPrompts = await listLatestUserPrompts(currentUser.id, 3);

  return (
    <DashboardPageClient
      initialSidebarCollapsed={initialSidebarCollapsed}
      recentPrompts={recentPrompts}
    />
  );
}
