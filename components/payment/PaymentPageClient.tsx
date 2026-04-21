'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, Sparkles } from '@/lib/icons';
import { fadeUp, pageContainer, sectionContainer } from '@/lib/motion/variants';

export type PaymentPlanCard = {
  key: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  credits: number;
  amount: number;
  priceId: string | null;
  featured?: boolean;
};

type PaymentPageClientProps = {
  plans: PaymentPlanCard[];
};

export default function PaymentPageClient({ plans }: PaymentPageClientProps) {
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  const planHighlights: Record<PaymentPlanCard['key'], string[]> = {
    basic: ['Fast checkout', '100 starter credits', 'Great for testing'],
    standard: ['Most popular choice', '300 credits included', 'Balanced value'],
    premium: ['Large credit bundle', 'Best for heavy use', 'Priority scale'],
  };

  const handleCheckout = async (planKey: PaymentPlanCard['key']) => {
    setPendingPlan(planKey);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planKey }),
      });

      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (response.status === 401) {
        router.push('/login?next=/pricing');
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to start checkout');
      }

      if (!payload.checkoutUrl) {
        throw new Error('Stripe did not return a checkout URL');
      }

      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to start checkout',
      );
    } finally {
      setPendingPlan(null);
    }
  };

  return (
    <motion.section
      className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8'
      variants={motionEnabled ? pageContainer : undefined}
      initial={motionEnabled ? 'hidden' : false}
      animate={motionEnabled ? 'show' : undefined}>
      <motion.div
        className='flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8'
        variants={motionEnabled ? fadeUp : undefined}>
        <div className='flex flex-wrap items-center gap-3'>
          <Badge className='rounded-full bg-emerald-100 px-3 py-1 text-emerald-900 hover:bg-emerald-100'>
            <Sparkles size={14} className='mr-1' />
            Test mode
          </Badge>
          <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600'>
            Secure Stripe checkout
          </span>
        </div>

        <div className='max-w-3xl space-y-3'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
            Buy test credits with Stripe Checkout
          </h1>
          <p className='text-sm leading-6 text-slate-600 sm:text-base'>
            Pick one of the test bundles below. Stripe handles the payment, the
            webhook credits your account once, and you get an email confirmation
            after fulfillment.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-3'>
          {['Instant handoff', 'Email receipt', 'One-time credit top-up'].map(
            item => (
              <div
                key={item}
                className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
                {item}
              </div>
            ),
          )}
        </div>
      </motion.div>

      <motion.div
        className='grid items-stretch gap-4 lg:grid-cols-3'
        variants={motionEnabled ? sectionContainer : undefined}>
        {plans.map(plan => {
          const isDisabled = !plan.priceId;
          const isPending = pendingPlan === plan.key;
          const highlights = planHighlights[plan.key];

          return (
            <motion.div
              key={plan.key}
              variants={motionEnabled ? fadeUp : undefined}
              whileHover={motionEnabled ? { y: -6 } : undefined}
              transition={{ duration: 0.24, ease: 'easeOut' }}>
              <Card
                className={`flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] ${
                  plan.featured ? 'ring-2 ring-emerald-300' : ''
                }`}>
                <CardHeader className='space-y-4 bg-linear-to-b from-slate-50 to-white'>
                  <div className='flex items-center justify-between gap-3'>
                    <CardTitle className='text-xl text-slate-950'>
                      {plan.name}
                    </CardTitle>
                    {plan.featured ? (
                      <Badge className='rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-100'>
                        Popular
                      </Badge>
                    ) : null}
                  </div>

                  <div className='space-y-1'>
                    <div className='text-4xl font-semibold tracking-tight text-slate-950'>
                      ${plan.amount}
                    </div>
                    <p className='text-sm text-slate-500'>
                      {plan.credits} credits
                    </p>
                  </div>

                  <p className='text-sm leading-6 text-slate-600'>
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className='mt-auto flex flex-1 flex-col justify-end gap-5 p-6 pt-0'>
                  <ul className='space-y-3 text-sm text-slate-600'>
                    {highlights.map(highlight => (
                      <li key={highlight} className='flex items-center gap-2'>
                        <CheckIcon className='size-4 shrink-0 text-emerald-600' />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className='h-12 w-full cursor-pointer bg-slate-950 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800'
                    disabled={isDisabled || isPending}
                    onClick={() => handleCheckout(plan.key)}>
                    {isPending
                      ? 'Starting checkout...'
                      : isDisabled
                        ? 'Configure Stripe price'
                        : 'Continue to Checkout'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
