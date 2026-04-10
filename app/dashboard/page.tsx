import { cookies } from 'next/headers';

import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );

  return (
    <DashboardPageClient initialSidebarCollapsed={initialSidebarCollapsed} />
  );
}
