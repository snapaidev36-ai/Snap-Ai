'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp } from '@/lib/motion/variants';
import { BackgroundPattern } from '../ui/background-pattern';

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <div className='relative min-h-dvh overflow-hidden bg-background px-4 sm:px-6'>
      <BackgroundPattern opacity={0.2} />

      <div className='relative z-10 flex h-dvh items-center justify-center'>
        <motion.div
          className='w-full sm:max-w-md'
          variants={motionEnabled ? fadeUp : undefined}
          initial={motionEnabled ? 'hidden' : false}
          animate={motionEnabled ? 'show' : undefined}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
