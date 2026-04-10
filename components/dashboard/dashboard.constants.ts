import type { LucideIcon } from 'lucide-react';
import { GalleryVerticalEnd, LayoutDashboard, Users } from 'lucide-react';

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

export const RECENT_PROMPTS = [
  'A warrior riding a massive dragon over snowy cliffs',
  'A rainy cyberpunk street at night with neon reflections',
  'Minimalist cinematic portrait with soft side lighting',
];

export const ASPECT_RATIO_OPTIONS = [
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
];

export const STYLE_OPTIONS = [
  { label: 'Photoreal', value: 'photoreal' },
  { label: 'Cinematic', value: 'cinematic' },
  { label: 'Digital Art', value: 'digital-art' },
  { label: 'Anime', value: 'anime' },
];
