import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import AuthBootstrap from '@/components/auth/AuthBootstrap';
import { Toaster } from '@/components/ui/sonner';
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE_TEMPLATE,
  metadataBase,
} from '@/lib/seo';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: SITE_NAME,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: {
      default: SITE_NAME,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: SITE_NAME,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthBootstrap />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
