'use client';

import { useState } from 'react';
import Link from 'next/link';

import { apiClient } from '@/lib/client/api';
import { formatBillingRangeLabel } from '@/lib/billing';
import type {
  BillingDateRange,
  BillingPageData,
  BillingSummary,
  BillingTransactionPage,
} from '@/lib/types/billing';
import { toast } from '@/components/ui/sonner';
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

type BillingPageClientProps = {
  initialData: BillingPageData;
};

type BillingSummaryResponse = {
  range: BillingDateRange;
  label: string;
  summary: BillingSummary;
};

type BillingTransactionsResponse = {
  range: BillingDateRange;
  label: string;
  items: BillingTransactionPage['items'];
  nextCursor: string | null;
};

export default function BillingPageClient({
  initialData,
}: BillingPageClientProps) {
  const [draftRange, setDraftRange] = useState(initialData.range);
  const [activeRange, setActiveRange] = useState(initialData.range);
  const [summary, setSummary] = useState(initialData.summary);
  const [transactions, setTransactions] = useState(
    initialData.transactions.items,
  );
  const [nextCursor, setNextCursor] = useState(
    initialData.transactions.nextCursor,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function handleReset() {
    setDraftRange(initialData.range);
    await loadRange(initialData.range);
  }

  async function loadRange(range: BillingDateRange) {
    setIsRefreshing(true);

    try {
      const [summaryResponse, transactionsResponse] = await Promise.all([
        apiClient<BillingSummaryResponse>(
          `/api/account/billing/summary?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`,
          { skipAuthRefresh: false },
        ),
        apiClient<BillingTransactionsResponse>(
          `/api/account/billing/transactions?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}&limit=10`,
          { skipAuthRefresh: false },
        ),
      ]);

      setActiveRange(summaryResponse.range);
      setDraftRange(summaryResponse.range);
      setSummary(summaryResponse.summary);
      setTransactions(transactionsResponse.items);
      setNextCursor(transactionsResponse.nextCursor);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to load billing data.',
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLoadMore() {
    if (!nextCursor) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const response = await apiClient<BillingTransactionsResponse>(
        `/api/account/billing/transactions?from=${encodeURIComponent(activeRange.from)}&to=${encodeURIComponent(activeRange.to)}&cursor=${encodeURIComponent(nextCursor)}&limit=10`,
        { skipAuthRefresh: false },
      );

      setTransactions(current => [...current, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to load more transactions.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

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
              pending credit purchases for{' '}
              {formatBillingRangeLabel(activeRange)}.
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
