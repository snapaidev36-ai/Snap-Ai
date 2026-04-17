'use client';

import Link from 'next/link';
import { Bell, Menu, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardBreadcrumbs from '@/components/dashboard/DashboardBreadcrumbs';
import { getInitials } from '@/lib/helpers';
import { useAuthStore } from '@/lib/store/auth-store';
import { useSidebarStore } from '@/lib/store/sidebar-store';

type DashboardHeaderProps = {
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
};

function hashFromString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function createAvatarStyle(seed: string) {
  const hue = hashFromString(seed) % 360;
  return {
    backgroundColor: `hsl(${hue} 74% 42%)`,
    color: 'hsl(0 0% 100%)',
  };
}

export default function DashboardHeader({
  onLogout,
  isLoggingOut,
}: DashboardHeaderProps) {
  const user = useAuthStore(state => state.user);
  const openMobileSidebar = useSidebarStore(state => state.openMobileSidebar);

  const credits = user?.credits ?? 0;
  const firstName = user?.firstName || 'Creator';
  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Snap AI User';
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <header className='bg-background/90 sticky top-0 z-30 shrink-0 border-b backdrop-blur'>
      <div className='flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            aria-label='Open sidebar'
            className='md:hidden'
            onClick={openMobileSidebar}>
            <Menu className='size-4' />
          </Button>

          <DashboardBreadcrumbs />
        </div>

        <div className='flex items-center gap-2 sm:gap-3'>
          <Badge
            className='h-8 rounded-full px-3 text-xs sm:text-sm'
            variant='secondary'>
            <Sparkles className='mr-1 size-3.5' /> Credits: {credits}
          </Badge>

          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Notifications'>
            <Bell className='size-4' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                className='h-10 gap-2 rounded-full px-1.5 sm:px-2'>
                <Avatar className='size-8'>
                  {user?.profileImageUrl ? (
                    <AvatarImage src={user.profileImageUrl} alt={fullName} />
                  ) : null}
                  <AvatarFallback style={createAvatarStyle(fullName)}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className='hidden max-w-24 truncate text-sm font-medium sm:inline-block'>
                  {firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
              <DropdownMenuLabel className='space-y-1'>
                <p className='truncate text-sm font-semibold'>{fullName}</p>
                <p className='text-muted-foreground truncate text-xs'>
                  {user?.email ?? 'guest@snap.ai'}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/account'>Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                disabled={isLoggingOut}
                onClick={event => {
                  event.preventDefault();
                  void onLogout();
                }}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
