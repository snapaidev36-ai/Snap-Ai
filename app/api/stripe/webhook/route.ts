import Stripe from 'stripe';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { jsonError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/services/stripe';
import {
  sendPaymentFailedEmail,
  sendPaymentSuccessEmail,
} from '@/lib/services/email';

export const runtime = 'nodejs';

function getPaymentOrderId(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  return session.metadata?.orderId ?? null;
}

async function sendSuccessEmailIfNeeded(order: {
  id: string;
  successEmailSentAt: Date | null;
  user: { email: string; firstName: string };
  planName: string;
  credits: number;
  amount: number;
}) {
  if (order.successEmailSentAt) {
    return;
  }

  await sendPaymentSuccessEmail({
    siteUrl: env.APP_URL ?? 'http://localhost:8001',
    to: order.user.email,
    firstName: order.user.firstName,
    planName: order.planName,
    credits: order.credits,
    amount: order.amount,
    dashboardUrl: `${env.APP_URL ?? 'http://localhost:8001'}/dashboard`,
  });

  await prisma.stripePayment.update({
    where: { id: order.id },
    data: {
      successEmailSentAt: new Date(),
    },
  });
}

async function sendFailureEmailIfNeeded(order: {
  id: string;
  failureEmailSentAt: Date | null;
  user: { email: string; firstName: string };
  planName: string;
  credits: number;
  amount: number;
}) {
  if (order.failureEmailSentAt) {
    return;
  }

  await sendPaymentFailedEmail({
    siteUrl: env.APP_URL ?? 'http://localhost:8001',
    to: order.user.email,
    firstName: order.user.firstName,
    planName: order.planName,
    credits: order.credits,
    amount: order.amount,
    retryUrl: `${env.APP_URL ?? 'http://localhost:8001'}/pricing`,
  });

  await prisma.stripePayment.update({
    where: { id: order.id },
    data: {
      failureEmailSentAt: new Date(),
    },
  });
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return jsonError('Stripe secret key is not configured', 500);
  }

  const signingSecret = env.STRIPE_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    return jsonError('Stripe webhook signing secret is not configured', 500);
  }

  const stripe = getStripeClient();

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return jsonError('Missing Stripe signature header', 400);
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, signingSecret);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Invalid Stripe webhook',
      400,
    );
  }

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.expired' &&
    event.type !== 'checkout.session.async_payment_failed'
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = getPaymentOrderId(event);

  const payment = orderId
    ? await prisma.stripePayment.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          planName: true,
          credits: true,
          amount: true,
          status: true,
          successEmailSentAt: true,
          failureEmailSentAt: true,
          stripeCheckoutSessionId: true,
          stripePaymentIntentId: true,
          user: {
            select: {
              email: true,
              firstName: true,
            },
          },
        },
      })
    : await prisma.stripePayment.findFirst({
        where: {
          stripeCheckoutSessionId: session.id,
        },
        select: {
          id: true,
          userId: true,
          planName: true,
          credits: true,
          amount: true,
          status: true,
          successEmailSentAt: true,
          failureEmailSentAt: true,
          stripeCheckoutSessionId: true,
          stripePaymentIntentId: true,
          user: {
            select: {
              email: true,
              firstName: true,
            },
          },
        },
      });

  if (!payment) {
    return NextResponse.json({
      received: true,
      detail: 'Payment record not found',
    });
  }

  if (event.type === 'checkout.session.completed') {
    if (payment.status !== 'COMPLETED') {
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null;

      await prisma.$transaction(async tx => {
        await tx.user.update({
          where: { id: payment.userId },
          data: {
            credits: {
              increment: payment.credits,
            },
          },
        });

        await tx.stripePayment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              paymentIntentId ?? payment.stripePaymentIntentId,
          },
        });
      });
    }

    try {
      await sendSuccessEmailIfNeeded(payment);
    } catch (error) {
      console.error('[stripe-webhook] failed to send success email', error);
      return jsonError(
        'Stripe payment processed but success email failed',
        500,
      );
    }

    return NextResponse.json({ received: true, detail: 'Payment completed' });
  }

  if (payment.status === 'COMPLETED') {
    return NextResponse.json({
      received: true,
      detail: 'Payment already completed',
    });
  }

  if (payment.status !== 'FAILED') {
    await prisma.stripePayment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        failureReason:
          event.type === 'checkout.session.expired'
            ? 'Checkout session expired before payment completed'
            : 'Stripe async payment failed',
      },
    });
  }

  try {
    await sendFailureEmailIfNeeded(payment);
  } catch (error) {
    console.error('[stripe-webhook] failed to send failure email', error);
    return jsonError(
      'Stripe payment failed but failure email could not be sent',
      500,
    );
  }

  return NextResponse.json({ received: true, detail: 'Payment failed' });
}
