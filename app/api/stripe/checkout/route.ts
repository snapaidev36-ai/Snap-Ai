import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { requireCurrentUser } from '@/lib/auth/current-user';
import { jsonError, jsonValidationError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import {
  getStripeCancelUrl,
  getStripeClient,
  getStripePaymentPlanByKey,
  getStripeSuccessUrl,
} from '@/lib/services/stripe';

export const runtime = 'nodejs';

const checkoutSchema = z.object({
  planKey: z.enum(['basic', 'standard', 'premium']),
});

export async function POST(request: NextRequest) {
  const authResult = await requireCurrentUser(request);

  if ('error' in authResult) {
    return authResult.error;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const plan = getStripePaymentPlanByKey(parsed.data.planKey);

  if (!plan) {
    return jsonError('Unsupported payment plan', 400);
  }

  if (!plan.priceId) {
    return jsonError(
      `Stripe price ID is not configured for the ${plan.name} plan`,
      500,
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return jsonError('Stripe secret key is not configured', 500);
  }

  const origin = request.nextUrl.origin;

  const payment = await prisma.stripePayment.create({
    data: {
      userId: authResult.user.id,
      planKey: plan.key,
      planName: plan.name,
      stripePriceId: plan.priceId,
      credits: plan.credits,
      amount: plan.amount,
      currency: 'usd',
      status: 'PENDING',
    },
  });

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: authResult.user.email,
      client_reference_id: payment.id,
      success_url: getStripeSuccessUrl(origin),
      cancel_url: getStripeCancelUrl(origin),
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        orderId: payment.id,
        userId: authResult.user.id,
        planKey: plan.key,
        planName: plan.name,
        credits: String(plan.credits),
        amount: String(plan.amount),
      },
      payment_intent_data: {
        metadata: {
          orderId: payment.id,
          userId: authResult.user.id,
          planKey: plan.key,
        },
      },
    });

    await prisma.stripePayment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
      },
    });

    if (!session.url) {
      await prisma.stripePayment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason:
            'Stripe checkout session did not return a redirect URL',
          failedAt: new Date(),
        },
      });

      return jsonError('Stripe checkout did not return a redirect URL', 500);
    }

    const response = NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });

    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    await prisma.stripePayment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        failureReason:
          error instanceof Error
            ? error.message
            : 'Unable to create checkout session',
        failedAt: new Date(),
      },
    });

    return jsonError('Unable to create Stripe checkout session', 500);
  }
}
