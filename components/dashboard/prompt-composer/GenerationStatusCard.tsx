'use client';

type GenerationStatusCardProps = {
  prompt: string | null;
};

export default function GenerationStatusCard({
  prompt,
}: GenerationStatusCardProps) {
  return (
    <div className='space-y-2 rounded-2xl border border-dashed bg-background/60 p-3'>
      <p className='text-sm font-medium text-foreground'>
        Generation in progress
      </p>
      <p className='text-muted-foreground text-xs'>
        Your image is being prepared. It will appear here when it is ready.
      </p>
      {prompt ? (
        <p className='text-muted-foreground text-xs'>{prompt}</p>
      ) : null}
    </div>
  );
}
