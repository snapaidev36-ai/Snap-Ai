import type { LucideIcon } from 'lucide-react';
import { GalleryVerticalEnd, LayoutDashboard, Users } from 'lucide-react';

import {
  ASPECT_RATIO_OPTIONS as GENERATION_ASPECT_RATIO_OPTIONS,
  STYLE_OPTIONS as GENERATION_STYLE_OPTIONS,
} from '@/lib/generation/options';

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Gallery',
    href: '/gallery',
    icon: GalleryVerticalEnd,
  },
  {
    label: 'Community',
    href: '/community',
    icon: Users,
  },
];

export const ASPECT_RATIO_OPTIONS = [...GENERATION_ASPECT_RATIO_OPTIONS];

export const STYLE_OPTIONS = [...GENERATION_STYLE_OPTIONS];
