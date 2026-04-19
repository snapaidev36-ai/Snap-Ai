import { renderEmailLayout } from '@/lib/email/templates/layout';

type VerifyEmailInput = {
  siteUrl: string;
  firstName: string;
  verifyEmailUrl: string;
};

export function buildVerifyEmail({
  siteUrl,
  firstName,
  verifyEmailUrl,
}: VerifyEmailInput) {
  const subject = 'Verify your Snap AI email';
  const previewText = 'Verify your Snap AI email address';

  return {
    subject,
    text: [
      `Hi ${firstName},`,
      '',
      'Welcome to Snap AI. Please verify your email address to activate your account.',
      `Open this link to verify your email: ${verifyEmailUrl}`,
      '',
      'If you did not create this account, you can ignore this email.',
    ].join('\n'),
    html: renderEmailLayout({
      siteUrl,
      previewText,
      title: 'Verify your email address',
      bodyHtml: [
        `<p style="margin:0 0 12px;">Hi ${firstName},</p>`,
        '<p style="margin:0 0 12px;">Welcome to Snap AI. Verify your email address to activate your account and continue.</p>',
        '<p style="margin:0;">This link does not expire.</p>',
      ].join(''),
      ctaLabel: 'Verify email',
      ctaUrl: verifyEmailUrl,
      footerText:
        'If you did not create this account, you can safely ignore this email.',
    }),
  };
}
