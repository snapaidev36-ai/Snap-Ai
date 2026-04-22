'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

export function useStripeCheckout() {
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = useCallback(
    async (planKey: string) => {
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
    },
    [router],
  );

  return {
    pendingPlan,
    handleCheckout,
  };
}
