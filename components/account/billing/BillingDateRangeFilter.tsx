'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  formatBillingInputDate,
  formatBillingRangeLabel,
  getDefaultBillingDateRange,
} from '@/lib/billing';
import type { BillingDateRange } from '@/lib/types/billing';

type BillingDateRangeFilterProps = {
  value: BillingDateRange;
  isLoading?: boolean;
  onChange: (range: BillingDateRange) => void;
  onApply: (range: BillingDateRange) => void;
  onReset: () => void;
};

function buildRelativeRange(days: number): BillingDateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  return {
    from: formatBillingInputDate(start),
    to: formatBillingInputDate(end),
  };
}

export default function BillingDateRangeFilter({
  value,
  isLoading,
  onChange,
  onApply,
  onReset,
}: BillingDateRangeFilterProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentMonthRange = useMemo(() => getDefaultBillingDateRange(), []);

  function handleRangeChange(nextValue: Partial<BillingDateRange>) {
    setErrorMessage(null);
    onChange({
      from: nextValue.from ?? value.from,
      to: nextValue.to ?? value.to,
    });
  }

  function applyPreset(range: BillingDateRange) {
    setErrorMessage(null);
    onChange(range);
    onApply(range);
  }

  function handleApply() {
    if (value.from > value.to) {
      setErrorMessage('The start date must be before the end date.');
      return;
    }

    setErrorMessage(null);
    onApply(value);
  }

  return (
    <Card className='border-border/70 bg-card/95 shadow-sm'>
      <CardHeader className='space-y-2'>
        <CardTitle>Filter by date range</CardTitle>
        <CardDescription>
          Change the billing window to update the summary cards and purchase
          table.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
          <label className='space-y-1.5 text-sm font-medium'>
            <span className='text-muted-foreground'>From</span>
            <Input
              type='date'
              value={value.from}
              onChange={event =>
                handleRangeChange({ from: event.target.value })
              }
            />
          </label>

          <label className='space-y-1.5 text-sm font-medium'>
            <span className='text-muted-foreground'>To</span>
            <Input
              type='date'
              value={value.to}
              onChange={event => handleRangeChange({ to: event.target.value })}
            />
          </label>

          <div className='flex flex-col gap-2 sm:col-span-2 lg:col-span-2 lg:flex-row lg:flex-wrap lg:items-end lg:justify-end'>
            <Button
              type='button'
              variant='outline'
              className='w-full lg:w-auto'
              onClick={() => applyPreset(buildRelativeRange(7))}>
              Last 7 days
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full lg:w-auto'
              onClick={() => applyPreset(buildRelativeRange(30))}>
              Last 30 days
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full lg:w-auto'
              onClick={() => applyPreset(currentMonthRange)}>
              This month
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full lg:w-auto'
              onClick={onReset}>
              Reset
            </Button>
            <Button
              type='button'
              className='w-full lg:w-auto'
              onClick={handleApply}
              disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Apply'}
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-sm text-muted-foreground'>
            Selected window: {formatBillingRangeLabel(value)}
          </p>
          {errorMessage ? (
            <p className='text-sm text-destructive'>{errorMessage}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
