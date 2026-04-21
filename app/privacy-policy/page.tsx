import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import PrivacyPolicyContent from '@/components/legal-pages/PrivacyPolicy';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'Read how Snap AI collects, uses, and protects your information.',
  path: '/privacy-policy',
  keywords: ['privacy policy', 'data protection', 'privacy'],
});

export default function PrivacyPolicy() {
  return (
    <main>
      <Header />
      <PrivacyPolicyContent />
      <Footer />
    </main>
  );
}
