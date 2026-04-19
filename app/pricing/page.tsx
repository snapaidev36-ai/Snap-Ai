import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import PaymentPageClient from '@/components/payment/PaymentPageClient';
import PricingStatusScreen from '@/components/pricing/PricingStatusScreen';
import { normalizeStatus } from '@/lib/helpers';
import { stripePaymentPlans } from '@/lib/services/stripe';
import Hero from '@/components/pricing/Hero';
import FAQ from '@/components/pricing/FAQ';

type PricingPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default async function Pricing({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = normalizeStatus(resolvedSearchParams?.status);

  if (status) {
    return <PricingStatusScreen status={status} />;
  }

  return (
    <main className='min-h-dvh bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)] text-slate-950'>
      <Header />
      <Hero />
      <div id='plans' className='pt-8 sm:pt-10 lg:pt-12'>
        <PaymentPageClient plans={stripePaymentPlans} />
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}
