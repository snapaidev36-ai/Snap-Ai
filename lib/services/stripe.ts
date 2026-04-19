import 'server-only';

import Stripe from 'stripe';

import { env } from '@/lib/env';

export type StripePaymentPlanKey = 'basic' | 'standard' | 'premium';

export type StripePaymentPlan = {
  key: StripePaymentPlanKey;
  name: string;
  description: string;
  credits: number;
  amount: number;
  priceId: string | null;
  featured?: boolean;
};

export const stripePaymentPlans: StripePaymentPlan[] = [
  {
    key: 'basic',
    name: 'Basic',
    description: 'A light test bundle for quick checkout validation.',
    credits: 40,
    amount: 5,
    priceId: env.STRIPE_BASIC_PRICE_ID ?? null,
  },
  {
    key: 'standard',
    name: 'Standard',
    description: 'The balanced test package for most runs.',
    credits: 120,
    amount: 12,
    priceId: env.STRIPE_STANDARD_PRICE_ID ?? null,
    featured: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    description: 'The largest bundle for stress testing the webhook flow.',
    credits: 300,
    amount: 25,
    priceId: env.STRIPE_PREMIUM_PRICE_ID ?? null,
  },
];

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is required for Stripe checkout and webhook handling',
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function getStripePaymentPlanByKey(planKey: string) {
  return stripePaymentPlans.find(plan => plan.key === planKey) ?? null;
}

export function getStripePaymentPlanByPriceId(priceId: string) {
  return stripePaymentPlans.find(plan => plan.priceId === priceId) ?? null;
}

export function getStripeSuccessUrl(origin: string) {
  return env.STRIPE_SUCCESS_URL ?? `${origin}/pricing?status=success`;
}

export function getStripeCancelUrl(origin: string) {
  return env.STRIPE_CANCEL_URL ?? `${origin}/pricing?status=cancelled`;
}
