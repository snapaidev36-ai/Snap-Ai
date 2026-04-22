import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import TermsOfServiceContent from '@/components/legal-pages/TermsOfService';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms of Service',
  description: 'Review the rules and terms for using Snap AI.',
  path: '/terms-of-service',
  keywords: ['terms of service', 'terms', 'legal'],
});

export default function TermsOfService() {
  return (
    <main>
      <Header />
      <TermsOfServiceContent />
      <Footer />
    </main>
  );
}
