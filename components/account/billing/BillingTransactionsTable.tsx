'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatBillingRangeLabel } from '@/lib/billing';
import { formatDate } from '@/lib/helpers';
import type { BillingDateRange, BillingTransaction } from '@/lib/types/billing';
import { Download } from '@/lib/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type BillingTransactionsTableProps = {
  range: BillingDateRange;
  items: BillingTransaction[];
  nextCursor: string | null;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  onLoadMore: () => void;
};

const statusClasses: Record<BillingTransaction['status'], string> = {
  pending:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
  completed:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  failed:
    'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
  canceled:
    'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatStatus(status: BillingTransaction['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BillingTransactionsTable({
  range,
  items,
  nextCursor,
  isLoadingMore,
  isRefreshing,
  onLoadMore,
}: BillingTransactionsTableProps) {
  const hasItems = items.length > 0;

  return (
    <Card className='border-border/70 bg-card/95 shadow-sm'>
      <CardHeader className='gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Purchase history for {formatBillingRangeLabel(range)}.
          </CardDescription>
        </div>

        <Button asChild variant='outline' className='shrink-0 max-w-50'>
          <Link
            href={`/api/account/billing/transactions/export?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`}
            download>
            Export CSV
            <Download className='size-4' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='overflow-hidden rounded-xl border border-border/70'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-muted/60 text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3 font-medium'>Plan</th>
                  <th className='px-4 py-3 font-medium'>Credits</th>
                  <th className='px-4 py-3 font-medium'>Amount</th>
                  <th className='px-4 py-3 font-medium'>Status</th>
                  <th className='px-4 py-3 font-medium'>Date</th>
                </tr>
              </thead>
              <tbody>
                {hasItems ? (
                  items.map(item => (
                    <tr
                      key={item.id}
                      className='border-t border-border/70 transition-colors hover:bg-muted/30'>
                      <td className='px-4 py-4 align-top'>
                        <div className='space-y-1'>
                          <p className='font-medium text-foreground'>
                            {item.planName}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 py-4 align-top font-medium text-foreground'>
                        {item.credits.toLocaleString()}
                      </td>
                      <td className='px-4 py-4 align-top text-muted-foreground'>
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className='px-4 py-4 align-top'>
                        <Badge
                          className={cn(
                            'capitalize',
                            statusClasses[item.status],
                          )}
                          variant='outline'>
                          {formatStatus(item.status)}
                        </Badge>
                      </td>
                      <td className='px-4 py-4 align-top text-muted-foreground'>
                        <div className='space-y-1'>
                          <p>{formatDate(item.createdAt)}</p>
                          {item.completedAt ? (
                            <p className='text-xs'>
                              Completed {formatDate(item.completedAt)}
                            </p>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-4 py-14 text-center'>
                      <div className='mx-auto max-w-sm space-y-2'>
                        <p className='font-medium text-foreground'>
                          No transactions found
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          There are no credit purchases in the selected range.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm text-muted-foreground'>
            {isRefreshing
              ? 'Refreshing transactions...'
              : `${items.length} purchase${items.length === 1 ? '' : 's'} loaded`}
          </p>
          <Button
            type='button'
            variant='outline'
            onClick={onLoadMore}
            disabled={!nextCursor || isLoadingMore}>
            {isLoadingMore
              ? 'Loading...'
              : nextCursor
                ? 'Load more'
                : 'No more results'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
