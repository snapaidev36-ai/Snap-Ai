import 'server-only';

import { Resend } from 'resend';

import { env } from '@/lib/env';
import { buildPasswordChangeEmail } from '@/lib/email/templates/password-change';
import { buildVerifyEmail } from '@/lib/email/templates/verify-email';

const resend = new Resend(env.RESEND_API_KEY);

type SendPasswordChangeEmailInput = {
  siteUrl: string;
  to: string;
  firstName: string;
  updatePasswordUrl: string;
};

type SendVerifyEmailInput = {
  siteUrl: string;
  to: string;
  firstName: string;
  verifyEmailUrl: string;
};

export async function sendPasswordChangeEmail({
  siteUrl,
  to,
  firstName,
  updatePasswordUrl,
}: SendPasswordChangeEmailInput) {
  const template = buildPasswordChangeEmail({
    siteUrl,
    firstName,
    updatePasswordUrl,
  });

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendVerifyEmail({
  siteUrl,
  to,
  firstName,
  verifyEmailUrl,
}: SendVerifyEmailInput) {
  const template = buildVerifyEmail({
    siteUrl,
    firstName,
    verifyEmailUrl,
  });

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}
