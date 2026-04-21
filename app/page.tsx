import type { Metadata } from 'next';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Hero from '@/components/landing/Hero';
import LandingPageSteps from '@/components/landing/LandingPageSteps';
import LandingPageTools from '@/components/landing/LandingPageTools';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'AI image builder for creative teams',
  description:
    'Create polished AI images, iterate on prompts, and manage your best generations in one place with Snap AI.',
  path: '/',
  keywords: ['AI image builder', 'prompt studio', 'creative AI workflow'],
});

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LandingPageSteps />
      <LandingPageTools />
      <Footer />
    </main>
  );
}
