'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';

import MobileSidebar from '@/components/dashboard/MobileSidebar';
import DashboardSidebarNav from '@/components/dashboard/DashboardSidebarNav';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/lib/store/sidebar-store';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const collapsed = useSidebarStore(state => state.collapsed);
  const hasInteracted = useSidebarStore(state => state.hasInteracted);
  const toggleCollapsed = useSidebarStore(state => state.toggleCollapsed);

  const subtleTransition =
    prefersReducedMotion || !hasInteracted
      ? { duration: 0 }
      : collapsed
        ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
        : { duration: 0.36, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <>
      <aside
        className={cn(
          'bg-sidebar/80 border-sidebar-border supports-backdrop-filter:bg-sidebar/65 hidden h-dvh shrink-0 border-r backdrop-blur-xl transition-[width] duration-300 ease-in-out md:flex md:flex-col',
        )}
        style={{
          width: collapsed ? 80 : 256,
          minWidth: 80,
        }}>
        <div className='flex h-16 items-center px-3'>
          <Link
            href={collapsed ? '/dashboard' : '/'}
            className='inline-flex items-center w-full'>
            <Image
              src='/logo.png'
              alt='Snap AI'
              width={36}
              height={36}
              className='size-9 rounded-md object-contain'
            />

            <motion.span
              initial={false}
              animate={{
                opacity: collapsed ? 0 : 1,
                x: collapsed ? -6 : 0,
              }}
              transition={subtleTransition}
              style={{
                maxWidth: collapsed ? 0 : 112,
                marginLeft: collapsed ? 0 : 8,
              }}
              className='inline-block overflow-hidden whitespace-nowrap font-bold'>
              Snap AI
            </motion.span>
          </Link>
        </div>

        <DashboardSidebarNav pathname={pathname} />

        <div
          className={cn(
            'mt-auto flex p-3',
            collapsed ? 'justify-center' : 'justify-end',
          )}>
          <Button
            type='button'
            size='icon-sm'
            variant='outline'
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleCollapsed}>
            <PanelLeft className='size-4' />
          </Button>
        </div>
      </aside>

      <MobileSidebar />
    </>
  );
}
