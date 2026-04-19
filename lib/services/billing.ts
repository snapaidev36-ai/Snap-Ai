import 'server-only';

import { StripePaymentStatus } from '@prisma/client';

import { parseBillingDateRange } from '@/lib/billing';
import { prisma } from '@/lib/prisma';
import type {
  BillingDateRange,
  BillingPageData,
  BillingSummary,
  BillingTransaction,
  BillingTransactionPage,
} from '@/lib/types/billing';

const DEFAULT_BILLING_LIMIT = 10;
const MAX_BILLING_LIMIT = 25;
const MAX_BILLING_EXPORT_BATCH = 500;

export type BillingRangeInput = {
  from?: string | null;
  to?: string | null;
};

export type BillingTransactionListInput = BillingRangeInput & {
  cursor?: string | null;
  limit?: number | null;
};

export const BILLING_TRANSACTION_CSV_COLUMNS = [
  { key: 'id', header: 'Transaction ID' },
  { key: 'planKey', header: 'Plan Key' },
  { key: 'planName', header: 'Plan Name' },
  { key: 'credits', header: 'Credits' },
  { key: 'amount', header: 'Amount' },
  { key: 'currency', header: 'Currency' },
  { key: 'status', header: 'Status' },
  { key: 'failureReason', header: 'Failure Reason' },
  { key: 'completedAt', header: 'Completed At' },
  { key: 'createdAt', header: 'Created At' },
  { key: 'updatedAt', header: 'Updated At' },
] as const;

type BillingTransactionQueryRow = {
  id: string;
  planKey: string;
  planName: string;
  stripePriceId: string;
  credits: number;
  amount: number;
  currency: string;
  status: StripePaymentStatus;
  failureReason: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toRangeWindow(range: BillingDateRange) {
  const fromDate = new Date(`${range.from}T00:00:00.000Z`);
  const toDate = new Date(`${range.to}T00:00:00.000Z`);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error('Invalid billing date range');
  }

  const start = new Date(
    Date.UTC(
      fromDate.getUTCFullYear(),
      fromDate.getUTCMonth(),
      fromDate.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  const end = new Date(
    Date.UTC(
      toDate.getUTCFullYear(),
      toDate.getUTCMonth(),
      toDate.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  return { start, end };
}

function clampLimit(limit?: number | null) {
  if (!limit || Number.isNaN(limit)) {
    return DEFAULT_BILLING_LIMIT;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), MAX_BILLING_LIMIT);
}

function toBillingTransaction(
  row: BillingTransactionQueryRow,
): BillingTransaction {
  return {
    id: row.id,
    planKey: row.planKey,
    planName: row.planName,
    stripePriceId: row.stripePriceId,
    credits: row.credits,
    amount: row.amount,
    currency: row.currency,
    status: row.status.toLowerCase() as BillingTransaction['status'],
    failureReason: row.failureReason,
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function buildTransactionQuery(
  userId: string,
  window: { start: Date; end: Date },
) {
  return {
    userId,
    createdAt: {
      gte: window.start,
      lte: window.end,
    },
  };
}

async function fetchBillingTransactionsPage(
  userId: string,
  range: BillingDateRange,
  input: {
    cursor?: string | null;
    limit: number;
  },
): Promise<BillingTransactionPage> {
  const window = toRangeWindow(range);

  const rows = await prisma.stripePayment.findMany({
    where: buildTransactionQuery(userId, window),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: input.limit + 1,
    ...(input.cursor
      ? {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }
      : {}),
    select: {
      id: true,
      planKey: true,
      planName: true,
      stripePriceId: true,
      credits: true,
      amount: true,
      currency: true,
      status: true,
      failureReason: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const items = rows.map(toBillingTransaction);
  const hasMore = items.length > input.limit;
  const pageItems = hasMore ? items.slice(0, input.limit) : items;

  return {
    items: pageItems,
    nextCursor: hasMore ? (pageItems[pageItems.length - 1]?.id ?? null) : null,
  };
}

export async function* iterateBillingTransactions(
  userId: string,
  range: BillingDateRange,
  batchSize = MAX_BILLING_EXPORT_BATCH,
): AsyncGenerator<BillingTransaction> {
  let cursor: string | null = null;

  while (true) {
    const page = await fetchBillingTransactionsPage(userId, range, {
      cursor,
      limit: batchSize,
    });

    if (page.items.length === 0) {
      break;
    }

    for (const item of page.items) {
      yield item;
    }

    if (!page.nextCursor) {
      break;
    }

    cursor = page.nextCursor;
  }
}

export async function getBillingSummary(
  userId: string,
  range: BillingDateRange,
): Promise<BillingSummary> {
  const window = toRangeWindow(range);

  const [user, purchasedCredits, usedCredits] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    }),
    prisma.stripePayment.aggregate({
      where: {
        userId,
        status: StripePaymentStatus.COMPLETED,
        completedAt: {
          gte: window.start,
          lte: window.end,
        },
      },
      _sum: { credits: true },
    }),
    prisma.usageHistory.aggregate({
      where: {
        userId,
        createdAt: {
          gte: window.start,
          lte: window.end,
        },
      },
      _sum: { creditsDeducted: true },
    }),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    creditsRemaining: user.credits,
    creditsPurchased: purchasedCredits._sum.credits ?? 0,
    creditsUsed: usedCredits._sum.creditsDeducted ?? 0,
    from: range.from,
    to: range.to,
  };
}

export async function listBillingTransactions(
  userId: string,
  input: BillingTransactionListInput,
): Promise<BillingTransactionPage> {
  const range = parseBillingDateRange({ from: input.from, to: input.to });

  if (!range) {
    throw new Error('Invalid billing date range');
  }

  const limit = clampLimit(input.limit);

  const page = await fetchBillingTransactionsPage(userId, range, {
    cursor: input.cursor,
    limit,
  });

  return {
    items: page.items,
    nextCursor: page.nextCursor,
  };
}

export async function getBillingPageData(
  userId: string,
  range: BillingDateRange,
  limit = DEFAULT_BILLING_LIMIT,
): Promise<BillingPageData> {
  const [summary, transactions] = await Promise.all([
    getBillingSummary(userId, range),
    listBillingTransactions(userId, {
      from: range.from,
      to: range.to,
      limit,
    }),
  ]);

  return {
    range,
    summary,
    transactions,
  };
}
