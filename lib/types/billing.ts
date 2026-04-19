export type BillingDateRange = {
  from: string;
  to: string;
};

export type BillingSummary = {
  creditsRemaining: number;
  creditsPurchased: number;
  creditsUsed: number;
  from: string;
  to: string;
};

export type BillingTransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'canceled';

export type BillingTransaction = {
  id: string;
  planKey: string;
  planName: string;
  stripePriceId: string;
  credits: number;
  amount: number;
  currency: string;
  status: BillingTransactionStatus;
  failureReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BillingTransactionPage = {
  items: BillingTransaction[];
  nextCursor: string | null;
};

export type BillingPageData = {
  range: BillingDateRange;
  summary: BillingSummary;
  transactions: BillingTransactionPage;
};
