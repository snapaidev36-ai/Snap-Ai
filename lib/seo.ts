import type { Metadata } from 'next';

import { env } from '@/lib/env';

export const SITE_NAME = 'Snap AI';
export const SITE_DESCRIPTION =
  'Create, explore, and manage AI-generated images with Snap AI.';
export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME}`;
export const SITE_KEYWORDS = [
  'Snap AI',
  'AI image generation',
  'prompt builder',
  'image creation',
  'creative workflows',
];
export const DEFAULT_OG_IMAGE_PATH = '/opengraph-image';

export const metadataBase = new URL(env.APP_URL ?? 'http://localhost:8001');

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
  keywords?: string[];
  noindex?: boolean;
  ogImagePath?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noindex = false,
  ogImagePath = DEFAULT_OG_IMAGE_PATH,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical: path,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImagePath],
    },
  };
}
