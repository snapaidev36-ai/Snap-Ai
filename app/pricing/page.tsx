import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import PaymentPageClient from '@/components/payment/PaymentPageClient';
import PricingStatusScreen from '@/components/pricing/PricingStatusScreen';
import { normalizeStatus } from '@/lib/helpers';
import { stripePaymentPlans } from '@/lib/services/stripe';
import { buildPageMetadata } from '@/lib/seo';
import Hero from '@/components/pricing/Hero';
import FAQ from '@/components/pricing/FAQ';

type PricingPageProps = {
  searchParams?: {
    status?: string;
  };
};

export async function generateMetadata({
  searchParams,
}: PricingPageProps): Promise<Metadata> {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = normalizeStatus(resolvedSearchParams?.status);

  if (status) {
    const title =
      status === 'success' ? 'Payment successful' : 'Payment failed';

    return buildPageMetadata({
      title,
      description:
        status === 'success'
          ? 'Your Snap AI payment was processed successfully. Review your updated plan and return to the app.'
          : 'Your Snap AI payment did not complete. Review your payment details or try again from the pricing page.',
      path: '/pricing',
      noindex: true,
      keywords: ['payment status', 'checkout result', 'billing'],
    });
  }

  return buildPageMetadata({
    title: 'Pricing and plans',
    description:
      'Compare Snap AI plans, choose the right credit bundle, and review payment options before you upgrade.',
    path: '/pricing',
    keywords: ['pricing', 'plans', 'credits', 'billing'],
  });
}

export default async function Pricing({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = normalizeStatus(resolvedSearchParams?.status);

  if (status) {
    return <PricingStatusScreen status={status} />;
  }

  return (
    <main className='scroll-smooth min-h-dvh bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)] text-slate-950'>
      <Header />
      <Hero />
      <div id='plans' className='scroll-mt-28 pt-8 sm:pt-10 lg:pt-12'>
        <PaymentPageClient plans={stripePaymentPlans} />
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}
