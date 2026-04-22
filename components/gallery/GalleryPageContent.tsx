'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import GeneratedImageGridSkeleton from '@/components/media/GeneratedImageGridSkeleton';
import ImagePromptPreviewModal from '@/components/media/ImagePromptPreviewModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronRight } from '@/lib/icons';
import {
  type GalleryApiItem,
  useGalleryFeed,
} from '@/lib/hooks/useGalleryFeed';
import { formatDate } from '@/lib/helpers';

export default function GalleryPageContent() {
  const {
    items,
    nextCursor,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMore,
  } = useGalleryFeed();
  const [selectedItem, setSelectedItem] = useState<GalleryApiItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasItems = items.length > 0;
  const PROMPT_PREVIEW_LIMIT = 180;

  function closePreview() {
    setIsPreviewOpen(false);
  }

  function openPreview(item: GalleryApiItem) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedItem(item);
    setIsPreviewOpen(true);
  }

  useEffect(() => {
    if (isPreviewOpen || !selectedItem) {
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setSelectedItem(null);
      closeTimerRef.current = null;
    }, 220);

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isPreviewOpen, selectedItem]);

  function handlePreviewOpenChange(open: boolean) {
    if (!open) {
      closePreview();
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
                <div className='space-y-3'>
                  <p className='text-muted-foreground line-clamp-4 text-sm leading-6'>
                    {item.prompt.length > PROMPT_PREVIEW_LIMIT
                      ? `${item.prompt.slice(0, PROMPT_PREVIEW_LIMIT).trimEnd()}...`
                      : item.prompt}
                  </p>

                  {item.prompt.length > PROMPT_PREVIEW_LIMIT ? (
                    <Button
                      type='button'
                      variant='ghost'
                      className='flex flex-wrap items-center gap-2 px-0 text-sm font-medium text-foreground/80 hover:text-foreground'
                      aria-label='Open prompt preview'
                      onClick={() => openPreview(item)}>
                      Read more
                      <ChevronRight size={14} />
                    </Button>
                  ) : null}
                </div>
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
          <Button type='button' variant='outline' onClick={loadMore}>
            {isLoadingMore ? 'Loading more...' : 'Load more'}
          </Button>
        </div>
      ) : null}

      <ImagePromptPreviewModal
        open={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
        title={selectedItem ? 'Prompt preview' : ''}
        description={
          selectedItem
            ? `${formatDate(selectedItem.createdAt)} · ${selectedItem.aspectRatio}`
            : ''
        }
        badge={selectedItem?.style ?? 'cinematic'}
        imageUrl={selectedItem?.imageUrl ?? '/placeholder-image.png'}
        imageAlt={selectedItem?.prompt ?? 'Generated image preview'}
        prompt={selectedItem?.prompt ?? 'Prompt not available'}
        details={
          selectedItem
            ? [
                { label: 'Style', value: selectedItem.style },
                { label: 'Aspect ratio', value: selectedItem.aspectRatio },
                {
                  label: 'Credits used',
                  value: `${selectedItem.creditsDeducted}`,
                },
              ]
            : []
        }
      />
    </div>
  );
}
