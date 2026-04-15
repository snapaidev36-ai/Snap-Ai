import { cn } from '@/lib/utils';

type GeneratedImageGridSkeletonProps = {
  count?: number;
  gridClassName?: string;
  cardClassName?: string;
  imageClassName?: string;
};

export default function GeneratedImageGridSkeleton({
  count = 6,
  gridClassName,
  cardClassName,
  imageClassName,
}: GeneratedImageGridSkeletonProps) {
  return (
    <div
      className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3', gridClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-3 shadow-sm',
            cardClassName,
          )}>
          <div className='space-y-3'>
            <div
              className={cn(
                'animate-pulse rounded-[1.15rem] bg-muted/70',
                imageClassName ?? 'aspect-square',
              )}
            />
            <div className='space-y-2'>
              <div className='h-4 w-4/5 animate-pulse rounded-full bg-muted/70' />
              <div className='h-3 w-2/3 animate-pulse rounded-full bg-muted/70' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
