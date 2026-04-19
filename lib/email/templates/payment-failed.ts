import { renderEmailLayout } from '@/lib/email/templates/layout';

type PaymentFailedEmailInput = {
  siteUrl: string;
  firstName: string;
  planName: string;
  credits: number;
  amount: number;
  retryUrl: string;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildPaymentFailedEmail({
  siteUrl,
  firstName,
  planName,
  credits,
  amount,
  retryUrl,
}: PaymentFailedEmailInput) {
  const formattedAmount = formatAmount(amount);

  return {
    subject: `Payment issue for ${planName}`,
    text: [
      `Hi ${firstName},`,
      '',
      `We could not complete your ${planName} payment for ${formattedAmount}.`,
      `The attempted purchase was for ${credits} credits.`,
      '',
      `Try again: ${retryUrl}`,
    ].join('\n'),
    html: renderEmailLayout({
      siteUrl,
      previewText: `Your ${planName} payment did not complete.`,
      title: `Payment issue for ${planName}`,
      bodyHtml: `
        <p>Hi ${firstName},</p>
        <p>We could not complete your <strong>${planName}</strong> payment for <strong>${formattedAmount}</strong>.</p>
        <p>The attempted purchase was for <strong>${credits} credits</strong>.</p>
      `,
      ctaLabel: 'Try again',
      ctaUrl: retryUrl,
      footerText:
        'If you already resolved this in Stripe, no further action is required.',
    }),
  };
}
