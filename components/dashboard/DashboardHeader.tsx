'use client';

import Image from 'next/image';
import { Bell, Menu, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useAuthStore } from '@/lib/store/auth-store';

type DashboardHeaderProps = {
  onOpenMobileSidebar: () => void;
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

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  const initials = `${first}${last}`.toUpperCase();

  return initials || 'AI';
}

export default function DashboardHeader({
  onOpenMobileSidebar,
  onLogout,
  isLoggingOut,
}: DashboardHeaderProps) {
  const user = useAuthStore(state => state.user);

  const credits = user?.credits ?? 0;
  const firstName = user?.firstName || 'Creator';
  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Snap AI User';
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <header className='bg-background/90 sticky top-0 z-30 border-b backdrop-blur'>
      <div className='flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            aria-label='Open sidebar'
            className='md:hidden'
            onClick={onOpenMobileSidebar}>
            <Menu className='size-4' />
          </Button>

          <Image
            src='/snap-logo-4.png'
            alt='Snap AI'
            width={116}
            height={40}
            className='h-8 w-auto'
            priority
          />
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
              <DropdownMenuItem>Account</DropdownMenuItem>
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
