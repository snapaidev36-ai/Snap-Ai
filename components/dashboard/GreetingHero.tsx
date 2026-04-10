'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';

import { useAuthStore } from '@/lib/store/auth-store';

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getGreetingByHour(hour: number) {
  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export default function GreetingHero() {
  const user = useAuthStore(state => state.user);
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const greeting = isClient
    ? getGreetingByHour(new Date().getHours())
    : 'Hello';
  const firstName = user?.firstName?.trim() || 'Creator';

  return (
    <section className='relative overflow-hidden rounded-3xl border bg-card p-4 shadow-sm sm:p-6'>
      <div className='mx-auto max-w-xl'>
        <div className='relative mx-auto h-26 w-52 sm:h-28 sm:w-58'>
          <div className='absolute left-0 top-3 h-22 w-20 rotate-[-10deg] overflow-hidden rounded-xl border bg-muted shadow-sm sm:h-24 sm:w-22'>
            <Image
              src='/home/home-1.webp'
              alt='Generated style one'
              fill
              className='object-cover'
              sizes='96px'
            />
          </div>
          <div className='absolute left-16 top-0 z-10 h-24 w-20 overflow-hidden rounded-xl border bg-muted shadow-sm sm:left-18 sm:h-26 sm:w-22'>
            <Image
              src='/home/home-2.png'
              alt='Generated style two'
              fill
              className='object-cover'
              sizes='96px'
            />
          </div>
          <div className='absolute left-32 top-3 h-22 w-20 rotate-10 overflow-hidden rounded-xl border bg-muted shadow-sm sm:left-36 sm:h-24 sm:w-22'>
            <Image
              src='/login-img.png'
              alt='Generated style three'
              fill
              className='object-cover'
              sizes='96px'
            />
          </div>
        </div>

        <div className='mt-4 text-center sm:mt-5'>
          <h2 className='text-2xl font-semibold tracking-tight text-foreground sm:text-4xl'>
            {greeting}, {firstName}! <span aria-hidden>👋</span>
          </h2>
          <p className='mt-2 text-sm text-muted-foreground sm:text-base'>
            Start creating your new AI image project with a style that fits your
            vision.
          </p>
        </div>
      </div>
    </section>
  );
}
