'use client';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalDetail = {
  label: string;
  value: string;
};

type ImagePromptPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  prompt: string;
  details: ModalDetail[];
};

export default function ImagePromptPreviewModal({
  open,
  onOpenChange,
  title,
  description,
  badge,
  imageUrl,
  imageAlt,
  prompt,
  details,
}: ImagePromptPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='p-0'>
        <div className='grid max-h-[90vh] lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='relative min-h-110 overflow-hidden bg-slate-950 lg:min-h-full'>
            <Image
              src={imageUrl ? imageUrl : '/placeholder-image.png'}
              alt={imageAlt}
              fill
              sizes='(min-width: 1024px) 55vw, 100vw'
              className='object-cover'
              unoptimized
            />
            <div className='absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/15 to-transparent' />
            <div className='absolute left-5 top-5 flex flex-wrap items-center gap-2'>
              <span className='rounded-full border border-white/15 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur'>
                {badge}
              </span>
            </div>
            <div className='absolute bottom-5 left-5 right-5 space-y-2 text-white'>
              <p className='text-xs font-medium uppercase tracking-[0.24em] text-white/70'>
                Image preview
              </p>
              <p className='max-w-md text-lg font-semibold leading-7 sm:text-xl'>
                {title}
              </p>
            </div>
          </div>

          <div className='flex min-h-0 flex-col bg-background'>
            <DialogHeader className='border-b border-border/70 bg-background/95 backdrop-blur'>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className='min-h-0 flex-1 overflow-y-auto px-6 pb-6 pr-5 sm:px-6'>
              <div className='grid gap-3 sm:grid-cols-2'>
                {details.map(detail => (
                  <div
                    key={detail.label}
                    className='rounded-2xl border border-border/70 bg-muted/35 px-4 py-3'>
                    <p className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
                      {detail.label}
                    </p>
                    <p className='mt-1 text-sm font-medium text-foreground'>
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-semibold text-foreground'>
                    Prompt
                  </p>
                  <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                    Scroll to read more
                  </span>
                </div>
                <p className='mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground'>
                  {prompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
