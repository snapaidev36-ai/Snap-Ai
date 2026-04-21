import type { Metadata } from 'next';

import AboutPageContent from '@/components/about/AboutPageContent';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About us',
  description:
    'Learn how Snap AI is building a simple, animated AI image experience for creators and teams.',
  path: '/about',
  keywords: ['about us', 'company', 'team', 'mission'],
});

export default function AboutPage() {
  return (
    <main>
      <Header />
      <AboutPageContent />
      <Footer />
    </main>
  );
}
