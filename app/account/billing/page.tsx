import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BillingPageClient from '@/components/account/billing/BillingPageClient';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { getCurrentUserFromCookies } from '@/lib/auth/current-user';
import { getBillingPageData } from '@/lib/services/billing';
import {
  getDefaultBillingDateRange,
  parseBillingDateRange,
} from '@/lib/billing';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

type BillingPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function firstSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );
  const currentUser = await getCurrentUserFromCookies(cookieStore);

  if (!currentUser) {
    redirect('/login?next=/account/billing');
  }

  const parsedRange = parseBillingDateRange({
    from: firstSearchParam(resolvedSearchParams?.from),
    to: firstSearchParam(resolvedSearchParams?.to),
  });

  const range = parsedRange ?? getDefaultBillingDateRange();
  const initialData = await getBillingPageData(currentUser.id, range);

  return (
    <DashboardPageClient
      initialSidebarCollapsed={initialSidebarCollapsed}
      contentClassName='max-w-7xl'>
      <BillingPageClient initialData={initialData} />
    </DashboardPageClient>
  );
}
