'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, PanelLeft } from 'lucide-react';

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
          'bg-sidebar/80 border-sidebar-border supports-[backdrop-filter]:bg-sidebar/65 hidden h-screen shrink-0 border-r backdrop-blur-xl transition-all duration-300 md:flex md:flex-col',
          collapsed ? 'md:w-20' : 'md:w-64',
        )}>
        <div
          className={cn(
            'flex h-16 items-center px-3',
            collapsed ? 'justify-center' : 'justify-between',
          )}>
          <Link href='/dashboard' className='inline-flex items-center'>
            {collapsed ? (
              <Image
                src='/snap-logo2.png'
                alt='Snap AI'
                width={36}
                height={36}
                className='size-9 rounded-md object-cover'
              />
            ) : (
              <Image
                src='/snap-logo-4.png'
                alt='Snap AI'
                width={124}
                height={44}
                className='h-9 w-auto'
              />
            )}
          </Link>

          {!collapsed ? (
            <Button
              type='button'
              size='icon-sm'
              variant='ghost'
              aria-label='Collapse sidebar'
              onClick={() => onCollapsedChange(true)}>
              <ChevronLeft className='size-4' />
            </Button>
          ) : null}
        </div>

        {renderNav(undefined, collapsed)}

        {collapsed ? (
          <div className='mt-auto flex justify-center p-3'>
            <Button
              type='button'
              size='icon-sm'
              variant='outline'
              aria-label='Expand sidebar'
              onClick={() => onCollapsedChange(false)}>
              <PanelLeft className='size-4' />
            </Button>
          </div>
        ) : null}
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
            <Image
              src='/snap-logo-4.png'
              alt='Snap AI'
              width={124}
              height={44}
              className='h-9 w-auto'
            />
          </SheetHeader>
          {renderNav(() => onMobileOpenChange(false), false)}
        </SheetContent>
      </Sheet>
    </>
  );
}
