import { renderEmailLayout } from '@/lib/email/templates/layout';

type PaymentSuccessEmailInput = {
  siteUrl: string;
  firstName: string;
  planName: string;
  credits: number;
  amount: number;
  dashboardUrl: string;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildPaymentSuccessEmail({
  siteUrl,
  firstName,
  planName,
  credits,
  amount,
  dashboardUrl,
}: PaymentSuccessEmailInput) {
  const formattedAmount = formatAmount(amount);

  return {
    subject: `Payment confirmed for ${planName}`,
    text: [
      `Hi ${firstName},`,
      '',
      `Your ${planName} payment for ${formattedAmount} is complete.`,
      `We have added ${credits} credits to your Snap AI account.`,
      '',
      `View your dashboard: ${dashboardUrl}`,
    ].join('\n'),
    html: renderEmailLayout({
      siteUrl,
      previewText: `Your ${planName} payment was confirmed and ${credits} credits were added.`,
      title: `Payment confirmed for ${planName}`,
      bodyHtml: `
        <p>Hi ${firstName},</p>
        <p>Your <strong>${planName}</strong> payment for <strong>${formattedAmount}</strong> is complete.</p>
        <p>We have added <strong>${credits} credits</strong> to your Snap AI account.</p>
      `,
      ctaLabel: 'View dashboard',
      ctaUrl: dashboardUrl,
      footerText: 'If you did not expect this email, you can safely ignore it.',
    }),
  };
}
