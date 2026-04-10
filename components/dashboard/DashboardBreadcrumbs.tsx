'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  gallery: 'Gallery',
  community: 'Community',
  discover: 'Discover',
  pricing: 'Pricing',
  login: 'Login',
  register: 'Register',
};

function formatSegmentLabel(segment: string) {
  const decodedSegment = decodeURIComponent(segment);
  const normalizedSegment = decodedSegment.replace(/[-_]+/g, ' ').trim();

  if (!normalizedSegment) {
    return 'Dashboard';
  }

  return normalizedSegment
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = ROUTE_LABELS[segment] ?? formatSegmentLabel(segment);

    return {
      href,
      label,
      isCurrentPage: index === pathSegments.length - 1,
    };
  });

  const currentPageLabel =
    breadcrumbItems.at(-1)?.label ?? ROUTE_LABELS.dashboard;

  return (
    <div className='min-w-0'>
      <p className='text-foreground truncate text-sm font-semibold sm:hidden'>
        {currentPageLabel}
      </p>

      <Breadcrumb className='hidden sm:block'>
        <BreadcrumbList>
          {breadcrumbItems.length > 0 ? (
            breadcrumbItems.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {item.isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
