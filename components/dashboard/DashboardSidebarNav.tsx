'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { DASHBOARD_NAV_ITEMS } from '@/components/dashboard/dashboard.constants';
import { useSidebarStore } from '@/lib/store/sidebar-store';
import { cn } from '@/lib/utils';

type DashboardSidebarNavProps = {
  pathname: string;
  mode?: 'desktop' | 'mobile';
};

export default function DashboardSidebarNav({
  pathname,
  mode = 'desktop',
}: DashboardSidebarNavProps) {
  const prefersReducedMotion = useReducedMotion();
  const collapsed = useSidebarStore(state => state.collapsed);
  const hasInteracted = useSidebarStore(state => state.hasInteracted);
  const closeMobileSidebar = useSidebarStore(state => state.closeMobileSidebar);

  const animateDesktop = mode === 'desktop';
  const compact = animateDesktop ? collapsed : false;
  const shouldAnimate = animateDesktop && hasInteracted;

  const subtleTransition =
    prefersReducedMotion || !shouldAnimate
      ? { duration: 0 }
      : compact
        ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
        : { duration: 0.36, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <nav className='mt-6 grid gap-2 px-3'>
      {DASHBOARD_NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (!animateDesktop) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileSidebar}
              className={cn(
                'group flex h-11 items-center rounded-lg border border-transparent px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                compact && 'justify-center px-0',
              )}>
              <Icon className={cn('size-4', !compact && 'mr-2')} />
              {!compact ? <span>{item.label}</span> : null}
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex h-11 items-center rounded-lg border border-transparent px-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}>
            <motion.span
              initial={false}
              animate={{
                x: compact ? 8 : 0,
                marginRight: compact ? 0 : 8,
              }}
              transition={subtleTransition}
              className='inline-flex items-center'>
              <Icon className='size-4' />
            </motion.span>

            <motion.span
              initial={false}
              animate={{
                opacity: compact ? 0 : 1,
                x: compact ? -4 : 0,
                maxWidth: compact ? 0 : 112,
              }}
              transition={subtleTransition}
              className='inline-block overflow-hidden whitespace-nowrap'>
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
