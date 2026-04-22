'use client';

import { useCallback, useState } from 'react';

import { apiClient } from '@/lib/client/api';
import { formatBillingRangeLabel } from '@/lib/billing';
import type {
  BillingDateRange,
  BillingPageData,
  BillingSummary,
  BillingTransactionPage,
} from '@/lib/types/billing';
import { toast } from '@/components/ui/sonner';

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

type UseBillingPageDataProps = {
  initialData: BillingPageData;
};

export function useBillingPageData({ initialData }: UseBillingPageDataProps) {
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

  const loadRange = useCallback(async (range: BillingDateRange) => {
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
  }, []);

  const handleReset = useCallback(async () => {
    setDraftRange(initialData.range);
    await loadRange(initialData.range);
  }, [initialData.range, loadRange]);

  const handleLoadMore = useCallback(async () => {
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
  }, [activeRange.from, activeRange.to, nextCursor]);

  return {
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
    activeRangeLabel: formatBillingRangeLabel(activeRange),
  };
}
