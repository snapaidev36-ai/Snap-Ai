import 'server-only';

import { Resend } from 'resend';

import { env } from '@/lib/env';

const resend = new Resend(env.RESEND_API_KEY);

type SendPasswordChangeEmailInput = {
  to: string;
  firstName: string;
  updatePasswordUrl: string;
};

export async function sendPasswordChangeEmail({
  to,
  firstName,
  updatePasswordUrl,
}: SendPasswordChangeEmailInput) {
  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: 'Confirm your Snap AI password change',
    text: [
      `Hi ${firstName},`,
      '',
      'We received a request to update your Snap AI password.',
      `Open this link to continue: ${updatePasswordUrl}`,
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${firstName},</p>
        <p>We received a request to update your Snap AI password.</p>
        <p>
          <a href="${updatePasswordUrl}" style="display:inline-block;padding:12px 18px;border-radius:9999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600;">
            Update password
          </a>
        </p>
        <p style="word-break:break-all;">Or paste this link into your browser: ${updatePasswordUrl}</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
