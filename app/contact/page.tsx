import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import ContactPageClient from '@/components/contact/ContactPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact us',
  description:
    'Contact the Snap AI team for support, billing questions, or product feedback.',
  path: '/contact',
  keywords: ['contact us', 'support', 'help', 'feedback'],
});

export default function ContactPage() {
  return (
    <main>
      <Header />
      <ContactPageClient />
      <Footer />
    </main>
  );
}
