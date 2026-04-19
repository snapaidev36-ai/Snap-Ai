'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useReducedMotion } from 'framer-motion';

import AuthShell from '@/components/auth/AuthShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PricingStatusScreenProps = {
  status: 'success' | 'failed';
};

function StatusMessage({ status }: PricingStatusScreenProps) {
  if (status === 'success') {
    return {
      badge: 'Payment successful',
      title: 'Your payment went through',
      body: 'Your credits were added successfully. You can now continue creating from your dashboard.',
      ctaLabel: 'Go to dashboard',
      ctaHref: '/dashboard',
      accentClass: 'bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100',
    };
  }

  return {
    badge: 'Payment failed',
    title: 'Your payment did not complete',
    body: 'Nothing was charged and no credits were added. You can go back to the plans and try again.',
    ctaLabel: 'Try again',
    ctaHref: '/pricing#plans',
    accentClass: 'bg-rose-50 border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-900 hover:bg-rose-100',
  };
}

export default function PricingStatusScreen({
  status,
}: PricingStatusScreenProps) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = useReducedMotion();
  const message = StatusMessage({ status });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const showConfetti =
    status === 'success' &&
    !prefersReducedMotion &&
    viewport.width > 0 &&
    viewport.height > 0;

  return (
    <AuthShell contentClassName='sm:max-w-4xl'>
      <div className='relative flex min-h-96 w-full items-center justify-center py-10 sm:py-14'>
        {showConfetti ? (
          <Confetti
            className='pointer-events-none fixed! inset-0 z-0'
            width={viewport.width}
            height={viewport.height}
            numberOfPieces={220}
            recycle={false}
            gravity={0.22}
            initialVelocityY={18}
            initialVelocityX={4}
            confettiSource={{
              x: viewport.width / 2,
              y: viewport.height * 0.18,
              w: 12,
              h: 12,
            }}
          />
        ) : null}

        <Card
          className={`relative z-10 mx-auto w-full max-w-md border shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${message.accentClass}`}>
          <CardHeader className='space-y-4 text-center'>
            <div className='flex justify-center'>
              <Badge className={`rounded-full px-3 py-1 ${message.badgeClass}`}>
                {message.badge}
              </Badge>
            </div>
            <CardTitle className='text-2xl text-slate-950 sm:text-3xl'>
              {message.title}
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6 text-center'>
            <p className='text-sm leading-6 text-slate-600 sm:text-base'>
              {message.body}
            </p>

            <Button
              asChild
              className='h-12 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800'>
              <Link href={message.ctaHref}>{message.ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
