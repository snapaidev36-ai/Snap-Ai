'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import GeneratedImageGridSkeleton from '@/components/media/GeneratedImageGridSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/client/api';
import { cn } from '@/lib/utils';

type CommunityApiItem = {
  id: string;
  prompt: string;
  creditsDeducted: number;
  creditsBefore: number;
  creditsAfter: number;
  aspectRatio: '1:1' | '4:3' | '9:16' | '16:9';
  style: 'photoreal' | 'cinematic' | 'anime' | 'digital art';
  imageUrl: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

type CommunityResponse = {
  items: CommunityApiItem[];
  nextCursor: string | null;
};

const ASPECT_RATIO_CLASS: Record<CommunityApiItem['aspectRatio'], string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-[16/9]',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function getAuthorName(user: CommunityApiItem['user']) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export default function CommunityPageContent() {
  const [items, setItems] = useState<CommunityApiItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCommunityFeed() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await apiClient<CommunityResponse>(
          '/api/community?limit=18',
          {
            skipAuthRefresh: true,
          },
        );

        if (!active) {
          return;
        }

        setItems(response.items);
        setNextCursor(response.nextCursor);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load the community feed right now.',
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCommunityFeed();

    return () => {
      active = false;
    };
  }, []);

  async function handleLoadMore() {
    if (!nextCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const response = await apiClient<CommunityResponse>(
        `/api/community?limit=18&cursor=${encodeURIComponent(nextCursor)}`,
        {
          skipAuthRefresh: true,
        },
      );

      setItems(previousItems => [...previousItems, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load more community images right now.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <section className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-4xl border border-border/70 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.8),rgba(130,255,115,0.08))] p-6 shadow-sm sm:p-8 dark:bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.16),transparent_30%),linear-gradient(135deg,rgba(19,19,19,0.96),rgba(130,255,115,0.07))]'>
        <div className='relative space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>Community feed</Badge>
            <Badge variant='outline'>Public preview</Badge>
          </div>
          <div className='max-w-3xl space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight sm:text-5xl'>
              Community creations with a subtle Snap AI watermark.
            </h1>
            <p className='text-muted-foreground text-sm leading-6 sm:text-base'>
              Browse the latest user generations. Each preview is proxied
              through Snap AI and composited with a branded watermark.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-8 space-y-6'>
        {errorMessage ? (
          <p
            className='rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive'
            role='alert'>
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <GeneratedImageGridSkeleton count={9} imageClassName='aspect-[4/5]' />
        ) : items.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {items.map(item => (
              <Card key={item.id} className='group gap-0 overflow-hidden py-0'>
                <div
                  className={cn(
                    'relative overflow-hidden',
                    ASPECT_RATIO_CLASS[item.aspectRatio],
                  )}>
                  <Image
                    src={item.imageUrl}
                    alt={item.prompt}
                    fill
                    unoptimized
                    sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
                    className='object-cover transition-transform duration-500 hover:scale-105'
                  />
                </div>
                <CardHeader className='space-y-2 px-4 pt-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <CardTitle className='truncate text-base'>
                      {getAuthorName(item.user)}
                    </CardTitle>
                    <Badge variant='secondary' className='shrink-0'>
                      {item.style}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {formatDate(item.createdAt)} · {item.aspectRatio}
                  </p>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <p className='text-muted-foreground text-sm leading-6'>
                    {item.prompt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='rounded-[1.75rem] border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center'>
            <p className='text-lg font-semibold'>No public creations yet.</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              As soon as users generate images, the feed will begin to fill.
            </p>
          </div>
        )}

        {nextCursor ? (
          <div className='flex justify-center'>
            <Button type='button' variant='outline' onClick={handleLoadMore}>
              {isLoadingMore ? 'Loading more...' : 'Load more'}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
