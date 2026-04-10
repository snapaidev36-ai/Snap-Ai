'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import DashboardSidebarNav from '@/components/dashboard/DashboardSidebarNav';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebarStore } from '@/lib/store/sidebar-store';

export default function MobileSidebar() {
  const pathname = usePathname();
  const mobileOpen = useSidebarStore(state => state.mobileOpen);
  const setMobileOpen = useSidebarStore(state => state.setMobileOpen);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
        <DashboardSidebarNav pathname={pathname} mode='mobile' />
      </SheetContent>
    </Sheet>
  );
}
