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
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm font-medium text-foreground'>
        Recent prompts:
      </span>
      {prompts.map(prompt => (
        <motion.button
          key={prompt}
          type='button'
          onClick={() => onPromptSelect(prompt)}
          variants={reduceMotion ? undefined : fadeUp}
          className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-3 py-1 text-xs transition-colors'>
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}
