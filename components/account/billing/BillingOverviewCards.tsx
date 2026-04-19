'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { formatBillingRangeLabel } from '@/lib/billing';
import type { BillingDateRange, BillingSummary } from '@/lib/types/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BillingOverviewCardsProps = {
  summary: BillingSummary;
  range: BillingDateRange;
};

function formatCredits(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

const cards = [
  {
    key: 'remaining',
    label: 'Credits remaining',
    className:
      'border-emerald-200/70 bg-[radial-gradient(circle_at_top_left,rgba(130,255,115,0.24),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(130,255,115,0.08))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-emerald-500/30 dark:bg-[radial-gradient(circle_at_top_left,rgba(130,255,115,0.2),transparent_40%),linear-gradient(135deg,rgba(18,18,18,0.98),rgba(130,255,115,0.08))]',
  },
  {
    key: 'used',
    label: 'Credits used',
    className:
      'border-slate-200/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(59,130,246,0.07))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_40%),linear-gradient(135deg,rgba(18,18,18,0.98),rgba(59,130,246,0.08))]',
  },
  {
    key: 'purchased',
    label: 'Credits purchased',
    className:
      'border-amber-200/70 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(245,158,11,0.08))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-amber-500/30 dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_40%),linear-gradient(135deg,rgba(18,18,18,0.98),rgba(245,158,11,0.08))]',
  },
] as const;

export default function BillingOverviewCards({
  summary,
  range,
}: BillingOverviewCardsProps) {
  const prefersReducedMotion = useReducedMotion();
  const rangeLabel = formatBillingRangeLabel(range);

  const values = {
    remaining: summary.creditsRemaining,
    used: summary.creditsUsed,
    purchased: summary.creditsPurchased,
  };

  return (
    <section className='grid items-stretch gap-4 lg:grid-cols-3'>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.key}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}>
            <Card
              className={cn(
                'relative flex h-full min-h-60 flex-col overflow-hidden border backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5',
                card.className,
              )}>
              <CardHeader className='relative z-10 pb-3'>
                <CardTitle className='flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300'>
                  <span>{card.label}</span>
                  <span className='text-xs font-normal text-slate-500/90 dark:text-slate-400'>
                    {rangeLabel}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className='relative z-10 flex flex-1 items-end justify-between gap-4 pb-6'>
                <div>
                  <p className='text-4xl font-semibold tracking-tight text-slate-950 dark:text-white'>
                    {formatCredits(values[card.key])}
                  </p>
                  <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
                    {card.key === 'remaining'
                      ? 'Available in your account today'
                      : card.key === 'used'
                        ? 'Consumed by generation activity'
                        : 'Credited by completed purchases'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
