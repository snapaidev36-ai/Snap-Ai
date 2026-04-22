import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import GalleryPageContent from '@/components/gallery/GalleryPageContent';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import { buildPageMetadata } from '@/lib/seo';
import {
  parseSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

export const metadata: Metadata = buildPageMetadata({
  title: 'Your creative gallery',
  description:
    'Review your Snap AI creations in a private gallery built to revisit, compare, and refine your best generations.',
  path: '/gallery',
  noindex: true,
  keywords: ['gallery', 'saved images', 'workspace'],
});

export default async function GalleryPage() {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = parseSidebarCollapsedCookie(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE_NAME)?.value,
  );

  return (
    <DashboardPageClient
      initialSidebarCollapsed={initialSidebarCollapsed}
      contentClassName='max-w-6xl'>
      <GalleryPageContent />
    </DashboardPageClient>
  );
}
