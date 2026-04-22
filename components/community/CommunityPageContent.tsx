'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import GeneratedImageGridSkeleton from '@/components/media/GeneratedImageGridSkeleton';
import ImagePromptPreviewModal from '@/components/media/ImagePromptPreviewModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from '@/lib/icons';
import {
  type CommunityApiItem,
  useCommunityFeed,
} from '@/lib/hooks/useCommunityFeed';
import { formatDate } from '@/lib/helpers';

function getAuthorName(user: CommunityApiItem['user']) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export default function CommunityPageContent() {
  const {
    items,
    nextCursor,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMore,
  } = useCommunityFeed();
  const [selectedItem, setSelectedItem] = useState<CommunityApiItem | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PROMPT_PREVIEW_LIMIT = 180;

  function closePreview() {
    setIsPreviewOpen(false);
  }

  function openPreview(item: CommunityApiItem) {
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
    <section className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-4xl border border-border/70 bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.8),rgba(130,255,115,0.08))] p-6 shadow-sm sm:p-8 dark:bg-[radial-gradient(circle_at_top_right,rgba(130,255,115,0.16),transparent_30%),linear-gradient(135deg,rgba(19,19,19,0.96),rgba(130,255,115,0.07))]'>
        <div className='relative space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>Community showcase</Badge>
            <Badge variant='outline'>Fresh inspiration</Badge>
          </div>
          <div className='max-w-3xl space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight sm:text-5xl'>
              See what the community is creating right now.
            </h1>
            <p className='text-muted-foreground text-sm leading-6 sm:text-base'>
              Browse standout generations from across Snap AI, discover new
              visual directions, and find ideas worth trying in your next
              prompt.
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
          <GeneratedImageGridSkeleton
            count={9}
            imageClassName='aspect-square'
          />
        ) : items.length > 0 ? (
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
                  <div className='space-y-3'>
                    <p className='text-muted-foreground line-clamp-4 text-sm leading-6'>
                      {item.prompt.length > PROMPT_PREVIEW_LIMIT
                        ? `${item.prompt.slice(0, PROMPT_PREVIEW_LIMIT).trimEnd()}...`
                        : item.prompt}
                    </p>

                    {item.prompt.length > PROMPT_PREVIEW_LIMIT ? (
                      <div className='flex flex-wrap items-center gap-2'>
                        <Button
                          type='button'
                          variant='ghost'
                          className='h-8 px-0 text-sm font-medium text-foreground/80 hover:text-foreground'
                          onClick={() => openPreview(item)}>
                          Read more
                        </Button>
                        <Button
                          type='button'
                          size='icon-sm'
                          variant='outline'
                          className='rounded-full'
                          aria-label='Open prompt preview'
                          onClick={() => openPreview(item)}>
                          <ChevronRight size={14} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='rounded-[1.75rem] border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center'>
            <p className='text-lg font-semibold'>
              The community feed is warming up.
            </p>
            <p className='text-muted-foreground mt-2 text-sm'>
              As soon as people start sharing, this space will fill with fresh
              work, new styles, and ideas to spark your next generation.
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
          title={selectedItem ? getAuthorName(selectedItem.user) : ''}
          description={
            selectedItem
              ? `Shared ${formatDate(selectedItem.createdAt)} · ${selectedItem.aspectRatio}`
              : ''
          }
          badge={selectedItem?.style ?? ''}
          imageUrl={selectedItem?.imageUrl ?? ''}
          imageAlt={selectedItem?.prompt ?? 'Community image preview'}
          prompt={selectedItem?.prompt ?? ''}
          details={
            selectedItem
              ? [
                  { label: 'Style', value: selectedItem.style },
                  { label: 'Aspect ratio', value: selectedItem.aspectRatio },
                  {
                    label: 'Credits used',
                    value: `${selectedItem.creditsDeducted}`,
                  },
                  { label: 'Creator', value: getAuthorName(selectedItem.user) },
                ]
              : []
          }
        />
      </div>
    </section>
  );
}
