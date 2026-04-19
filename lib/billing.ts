export type BillingDateRange = {
  from: string;
  to: string;
};

const BILLING_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toBillingDateOnly(value: Date) {
  return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
}

function parseBillingDateOnly(value: string) {
  if (!BILLING_DATE_PATTERN.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDefaultBillingDateRange(
  referenceDate = new Date(),
): BillingDateRange {
  const startOfMonth = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
  );

  return {
    from: toBillingDateOnly(startOfMonth),
    to: toBillingDateOnly(referenceDate),
  };
}

export function parseBillingDateRange(input: {
  from?: string | null;
  to?: string | null;
}): BillingDateRange | null {
  const fallback = getDefaultBillingDateRange();
  const from = input.from?.trim() || fallback.from;
  const to = input.to?.trim() || fallback.to;

  const fromDate = parseBillingDateOnly(from);
  const toDate = parseBillingDateOnly(to);

  if (!fromDate || !toDate) {
    return null;
  }

  if (fromDate > toDate) {
    return null;
  }

  return { from, to };
}

export function formatBillingRangeLabel(range: BillingDateRange) {
  const from = parseBillingDateOnly(range.from);
  const to = parseBillingDateOnly(range.to);

  if (!from || !to) {
    return 'Selected range';
  }

  const format = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${format.format(from)} to ${format.format(to)}`;
}

export function buildBillingRangeFromDates(
  from: Date,
  to: Date,
): BillingDateRange {
  return {
    from: toBillingDateOnly(from),
    to: toBillingDateOnly(to),
  };
}

export function formatBillingInputDate(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}
