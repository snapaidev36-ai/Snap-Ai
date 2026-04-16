'use client';

import { motion } from 'framer-motion';

import { fadeUp } from '@/lib/motion/variants';

type RecentPromptsChipsProps = {
  prompts: string[];
  reduceMotion: boolean;
  onPromptSelect: (prompt: string) => void;
};

export default function RecentPromptsChips({
  prompts,
  reduceMotion,
  onPromptSelect,
}: RecentPromptsChipsProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <section className='rounded-3xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='space-y-1'>
          <span className='text-sm font-semibold capitalize'>
            Recent prompts
          </span>
          <p className='text-xs text-muted-foreground'>
            Pick one to reuse it in the composer.
          </p>
        </div>
      </div>

      <div className='mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {prompts.map(prompt => (
          <motion.button
            key={prompt}
            type='button'
            onClick={() => onPromptSelect(prompt)}
            variants={reduceMotion ? undefined : fadeUp}
            className='flex min-h-16 w-full items-start rounded-2xl border border-border/70 bg-secondary/35 px-4 py-3 text-left text-sm leading-5 text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/55'>
            <span className='line-clamp-2'>{prompt}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
