import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Hero from '@/components/discover/Hero';
import Header from '@/components/header/Header';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Discover prompts and inspiration',
  description:
    'Browse Snap AI discoveries, prompts, and creative inspiration from across the product.',
  path: '/discover',
  keywords: ['discover', 'prompts', 'inspiration', 'explore'],
});

export default function Discover() {
  return (
    <main>
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
