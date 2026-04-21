import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import CommunityPageContent from '@/components/community/CommunityPageContent';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { buildPageMetadata } from '@/lib/seo';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

export const metadata: Metadata = buildPageMetadata({
  title: 'Community gallery',
  description:
    'Explore community-created images and shared inspiration inside Snap AI.',
  path: '/community',
  noindex: true,
  keywords: ['community', 'gallery', 'shared creations'],
});

export default async function CommunityPage() {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );

  return (
    <DashboardPageClient
      initialSidebarCollapsed={initialSidebarCollapsed}
      contentClassName='max-w-6xl'>
      <CommunityPageContent />
    </DashboardPageClient>
  );
}
