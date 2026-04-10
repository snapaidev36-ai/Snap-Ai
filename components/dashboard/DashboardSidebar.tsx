'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';

import { DASHBOARD_NAV_ITEMS } from '@/components/dashboard/dashboard.constants';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type DashboardSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export default function DashboardSidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  function renderNav(onNavigate?: () => void, compact?: boolean) {
    return (
      <nav className='mt-6 grid gap-2 px-3'>
        {DASHBOARD_NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
        })}
      </nav>
    );
  }

  return (
    <>
      <aside
        className={cn(
          'bg-sidebar/80 border-sidebar-border supports-backdrop-filter:bg-sidebar/65 hidden h-dvh shrink-0 border-r backdrop-blur-xl transition-all duration-300 md:flex md:flex-col',
          collapsed ? 'md:w-20' : 'md:w-64',
        )}>
        <div
          className={cn(
            'flex h-16 items-center px-3',
            collapsed ? 'justify-center' : 'justify-start',
          )}>
          <Link
            href={collapsed ? '/dashboard' : '/'}
            className='inline-flex items-center'>
            {collapsed ? (
              <Image
                src='/logo.png'
                alt='Snap AI'
                width={36}
                height={36}
                className='size-9 rounded-md object-contain'
              />
            ) : (
              <span className='flex items-center gap-2'>
                <Image
                  src='/logo.png'
                  alt='Snap AI'
                  width={36}
                  height={36}
                  className='h-9 object-contain'
                />
                <span className='font-bold'>Snap AI</span>
              </span>
            )}
          </Link>
        </div>

        {renderNav(undefined, collapsed)}

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
            onClick={() => onCollapsedChange(!collapsed)}>
            <PanelLeft className='size-4' />
          </Button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side='left'
          className='bg-sidebar/95 border-sidebar-border w-[84%] p-0 text-sidebar-foreground backdrop-blur-xl'>
          <SheetHeader className='px-4 pt-6 pb-2'>
            <SheetTitle className='sr-only'>Sidebar navigation</SheetTitle>
            <SheetDescription className='sr-only'>
              Navigate dashboard sections
            </SheetDescription>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/logo.png'
                alt='Snap AI'
                width={36}
                height={36}
                className='h-9 object-contain'
              />
              <span className='font-bold'>Snap AI</span>
            </Link>
          </SheetHeader>
          {renderNav(() => onMobileOpenChange(false), false)}
        </SheetContent>
      </Sheet>
    </>
  );
}
