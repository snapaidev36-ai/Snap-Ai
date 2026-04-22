'use client';

import Link from 'next/link';

import type { BillingPageData } from '@/lib/types/billing';
import BillingDateRangeFilter from '@/components/account/billing/BillingDateRangeFilter';
import BillingOverviewCards from '@/components/account/billing/BillingOverviewCards';
import BillingTransactionsTable from '@/components/account/billing/BillingTransactionsTable';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronRight } from '@/lib/icons';
import { useBillingPageData } from '@/lib/hooks/useBillingPageData';

type BillingPageClientProps = {
  initialData: BillingPageData;
};

export default function BillingPageClient({
  initialData,
}: BillingPageClientProps) {
  const {
    draftRange,
    setDraftRange,
    activeRange,
    summary,
    transactions,
    nextCursor,
    isRefreshing,
    isLoadingMore,
    loadRange,
    handleReset,
    handleLoadMore,
    activeRangeLabel,
  } = useBillingPageData({ initialData });

  return (
    <div className='space-y-6'>
      <Card className='overflow-hidden border-border/70 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.12),transparent_30%),linear-gradient(135deg,rgba(18,18,18,0.98),rgba(12,12,12,0.98))]'>
        <CardHeader className='gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-2'>
            <CardTitle className='text-3xl font-semibold tracking-tight'>
              Billing
            </CardTitle>
            <CardDescription className='max-w-2xl text-base'>
              Monitor credits remaining, credits purchased, and credits used
              over the range you choose. The table below shows completed and
              pending credit purchases for {activeRangeLabel}.
            </CardDescription>
          </div>

          <Button asChild variant='outline' className='shrink-0 max-w-50'>
            <Link href='/account'>
              Back to account
              <ChevronRight className='size-4' />
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <BillingOverviewCards summary={summary} range={activeRange} />

      <BillingDateRangeFilter
        value={draftRange}
        isLoading={isRefreshing}
        onChange={setDraftRange}
        onApply={loadRange}
        onReset={handleReset}
      />

      <BillingTransactionsTable
        range={activeRange}
        items={transactions}
        nextCursor={nextCursor}
        isLoadingMore={isLoadingMore}
        isRefreshing={isRefreshing}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
