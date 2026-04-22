'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import GeneratedImageGridSkeleton from '@/components/media/GeneratedImageGridSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { apiClient } from '@/lib/client/api';
import { formatDate } from '@/lib/helpers';

type GalleryApiItem = {
  id: string;
  prompt: string;
  creditsDeducted: number;
  creditsBefore: number;
  creditsAfter: number;
  aspectRatio: '1:1' | '4:3' | '9:16' | '16:9';
  style: 'photoreal' | 'cinematic' | 'anime' | 'digital art';
  imageUrl: string;
  createdAt: string;
};

type GalleryResponse = {
  items: GalleryApiItem[];
  nextCursor: string | null;
};

export default function GalleryPageContent() {
  const [items, setItems] = useState<GalleryApiItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasItems = items.length > 0;

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await apiClient<GalleryResponse>(
          '/api/gallery?limit=18',
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
            : 'Unable to load your gallery right now.',
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadGallery();

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
      const response = await apiClient<GalleryResponse>(
        `/api/gallery?limit=18&cursor=${encodeURIComponent(nextCursor)}`,
      );

      setItems(previousItems => [...previousItems, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load more images right now.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className='space-y-6'>
      <section className='relative overflow-hidden rounded-4xl border border-border/70 bg-linear-to-br from-background via-background to-primary/10 p-6 shadow-sm sm:p-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(130,255,115,0.09),transparent_26%)]' />
        <div className='relative space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>Creative archive</Badge>
            <Badge variant='outline'>Private collection</Badge>
          </div>
          <div className='max-w-2xl space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              Your best creations, gathered in one calm place.
            </h1>
            <p className='text-muted-foreground text-sm leading-6 sm:text-base'>
              Revisit the images you have made, compare ideas side by side, and
              keep your favorite generations close whenever you want to return
              to them.
            </p>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <p
          className='rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive'
          role='alert'>
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <GeneratedImageGridSkeleton count={6} imageClassName='aspect-square' />
      ) : hasItems ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {items.map(item => (
            <Card key={item.id} className='group gap-0 overflow-hidden py-0'>
              <div className='relative aspect-square overflow-hidden'>
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  unoptimized
                  sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              <CardHeader className='space-y-2 px-4 pt-4'>
                <Badge variant='secondary' className='shrink-0 max-w-max'>
                  {item.style}
                </Badge>
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
          <p className='text-lg font-semibold'>
            Your gallery is waiting for its first piece.
          </p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Create an image and it will appear here automatically, ready to
            revisit, download, and build on.
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
  );
}
