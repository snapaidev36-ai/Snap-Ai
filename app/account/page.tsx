import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import AccountPageClient from '@/components/account/AccountPageClient';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { getCurrentUserFromCookies } from '@/lib/auth/current-user';
import { toAuthUser } from '@/lib/auth/user-profile';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );
  const currentUser = await getCurrentUserFromCookies(cookieStore);

  if (!currentUser) {
    redirect('/login?next=/account');
  }

  return (
    <DashboardPageClient
      initialSidebarCollapsed={initialSidebarCollapsed}
      contentClassName='max-w-6xl'>
      <AccountPageClient user={toAuthUser(currentUser)} />
    </DashboardPageClient>
  );
}
