'use client';

import Image from 'next/image';

type GenerationResultCardProps = {
  imageUrl: string;
  prompt: string | null;
};

export default function GenerationResultCard({
  imageUrl,
  prompt,
}: GenerationResultCardProps) {
  return (
    <div className='mx-auto w-full space-y-3 rounded-2xl border bg-background/60 p-3'>
      <div className='flex items-center justify-between gap-2'>
        <div>
          <p className='text-sm font-medium text-foreground'>
            Latest generation
          </p>
          {prompt ? (
            <p className='text-muted-foreground text-xs'>{prompt}</p>
          ) : null}
        </div>
      </div>

      <div className='relative aspect-square overflow-hidden rounded-xl border bg-muted sm:aspect-4/3 lg:aspect-16/10'>
        <Image
          src={imageUrl}
          alt='Generated image preview'
          fill
          unoptimized
          sizes='100vw'
          className='object-contain'
        />
      </div>
    </div>
  );
}
