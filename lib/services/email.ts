import 'server-only';

import { Resend } from 'resend';

import { env } from '@/lib/env';
import { buildContactMessageEmail } from '@/lib/email/templates/contact-message';
import { buildPaymentFailedEmail } from '@/lib/email/templates/payment-failed';
import { buildPaymentSuccessEmail } from '@/lib/email/templates/payment-success';
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

type SendPaymentSuccessEmailInput = {
  siteUrl: string;
  to: string;
  firstName: string;
  planName: string;
  credits: number;
  amount: number;
  dashboardUrl: string;
};

type SendPaymentFailedEmailInput = {
  siteUrl: string;
  to: string;
  firstName: string;
  planName: string;
  credits: number;
  amount: number;
  retryUrl: string;
};

type SendContactMessageEmailInput = {
  siteUrl: string;
  to: string;
  name: string;
  email: string;
  subject: string;
  message: string;
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

export async function sendPaymentSuccessEmail({
  siteUrl,
  to,
  firstName,
  planName,
  credits,
  amount,
  dashboardUrl,
}: SendPaymentSuccessEmailInput) {
  const template = buildPaymentSuccessEmail({
    siteUrl,
    firstName,
    planName,
    credits,
    amount,
    dashboardUrl,
  });

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendPaymentFailedEmail({
  siteUrl,
  to,
  firstName,
  planName,
  credits,
  amount,
  retryUrl,
}: SendPaymentFailedEmailInput) {
  const template = buildPaymentFailedEmail({
    siteUrl,
    firstName,
    planName,
    credits,
    amount,
    retryUrl,
  });

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendContactMessageEmail({
  siteUrl,
  to,
  name,
  email,
  subject,
  message,
}: SendContactMessageEmailInput) {
  const template = buildContactMessageEmail({
    siteUrl,
    name,
    email,
    subject,
    message,
  });

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    replyTo: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}
