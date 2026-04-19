'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <section className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8'>
        <div className='flex flex-wrap items-center gap-3'>
          <Badge className='rounded-full bg-emerald-100 px-3 py-1 text-emerald-900 hover:bg-emerald-100'>
            Test mode
          </Badge>
        </div>

        <div className='max-w-3xl space-y-3'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
            Buy test credits with Stripe Checkout
          </h1>
          <p className='text-sm leading-6 text-slate-600 sm:text-base'>
            Pick one of the test bundles below. Stripe will handle the payment,
            the webhook will credit your account once, and you will get an email
            confirmation after fulfillment.
          </p>
        </div>
      </div>

      <div className='grid items-stretch gap-4 lg:grid-cols-3'>
        {plans.map(plan => {
          const isDisabled = !plan.priceId;
          const isPending = pendingPlan === plan.key;

          return (
            <Card
              key={plan.key}
              className={`flex h-full flex-col border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] ${
                plan.featured ? 'ring-2 ring-emerald-300' : ''
              }`}>
              <CardHeader className='space-y-3'>
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
                  <div className='text-3xl font-semibold text-slate-950'>
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

              <CardContent className='mt-auto flex flex-1 flex-col justify-end gap-4'>
                <Button
                  className='h-12 w-full xs:max-w-75 cursor-pointer bg-slate-950 text-white hover:bg-slate-800'
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
          );
        })}
      </div>
    </section>
  );
}
