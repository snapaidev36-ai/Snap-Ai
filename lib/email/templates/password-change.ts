import { renderEmailLayout } from '@/lib/email/templates/layout';

type PasswordChangeEmailInput = {
  siteUrl: string;
  firstName: string;
  updatePasswordUrl: string;
};

export function buildPasswordChangeEmail({
  siteUrl,
  firstName,
  updatePasswordUrl,
}: PasswordChangeEmailInput) {
  const subject = 'Confirm your Snap AI password change';
  const previewText = 'Confirm your Snap AI password change';

  return {
    subject,
    text: [
      `Hi ${firstName},`,
      '',
      'We received a request to update your Snap AI password.',
      `Open this link to continue: ${updatePasswordUrl}`,
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
    html: renderEmailLayout({
      siteUrl,
      previewText,
      title: 'Confirm your password change',
      bodyHtml: [
        `<p style="margin:0 0 12px;">Hi ${firstName},</p>`,
        '<p style="margin:0 0 12px;">We received a request to update your Snap AI password.</p>',
        '<p style="margin:0;">Use the button below to continue.</p>',
      ].join(''),
      ctaLabel: 'Update password',
      ctaUrl: updatePasswordUrl,
      footerText:
        'If you did not request this change, you can safely ignore this email.',
    }),
  };
}
