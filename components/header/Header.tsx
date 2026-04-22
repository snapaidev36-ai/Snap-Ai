'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface AiHeader2Props {
  togglemenu?: () => void;
  onClickOutside?: () => void;
}

const Header: React.FC<AiHeader2Props> = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);

  const primaryActionLabel = initialized
    ? user
      ? 'Dashboard'
      : 'Start now'
    : 'Loading...';

  function handlePrimaryAction() {
    if (!initialized) {
      return;
    }

    router.push(user ? '/dashboard' : '/login');
  }
  return (
    <div className='fixed z-50 lg:z-20 lg:relative bg-[#FAFAFA] lg:bg-transparent top-0 w-full flex items-center justify-between px-5 lg:px-8 py-4 lg:py-8'>
      <div className='flex items-center gap-6'>
        <Link href='/'>
          <Image
            src='/logo.png'
            alt='Logo'
            width={36}
            height={36}
            className='inline-block align-middle'
          />
        </Link>

        <div className='col-span-6 hidden lg:block'>
          <ul className='flex gap-6 justify-center font-semibold'>
            <li>
              <Link href='/discover'>{'Discover'}</Link>
            </li>
            <li>
              <Link href='/pricing'>{'Pricing'}</Link>
            </li>
            <li>
              <Link href='/about'>{'About us'}</Link>
            </li>
            <li>
              <Link href='/contact'>{'Contact us'}</Link>
            </li>
          </ul>
        </div>
      </div>
      <Button onClick={handlePrimaryAction} disabled={!initialized}>
        {primaryActionLabel}
      </Button>
    </div>
  );
};

export default Header;
