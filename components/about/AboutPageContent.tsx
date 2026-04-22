'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { BackgroundPattern } from '@/components/ui/background-pattern';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fadeUp, pageContainer } from '@/lib/motion/variants';

const highlights = [
  {
    title: 'Built for creators',
    description:
      'Snap AI keeps generation, browsing, and billing in one flow so teams can move faster.',
  },
  {
    title: 'Clear workflows',
    description:
      'Every screen focuses on the next useful step: prompt, generate, save, review, and share.',
  },
  {
    title: 'Simple by design',
    description:
      'We keep the interface lightweight so the output stays centered and the product stays easy to trust.',
  },
];

const stats = [
  { value: 'Fast', label: 'feedback loop' },
  { value: 'One', label: 'workspace for creation' },
  { value: 'Clear', label: 'account and billing paths' },
];

export default function AboutPageContent() {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <main className='relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#f8fafc_100%)] text-slate-950'>
      <BackgroundPattern
        opacity={0.08}
        className='pointer-events-none absolute inset-0'
      />

      <section className='relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32'>
        <motion.div
          className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'
          variants={motionEnabled ? pageContainer : undefined}
          initial={motionEnabled ? 'hidden' : false}
          animate={motionEnabled ? 'show' : undefined}>
          <motion.div
            variants={motionEnabled ? fadeUp : undefined}
            className='space-y-6'>
            <p className='inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800'>
              About Snap AI
            </p>

            <div className='space-y-4'>
              <h1 className='max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl'>
                We build a focused AI image experience that feels simple to use.
              </h1>
              <p className='max-w-2xl text-lg leading-8 text-slate-600'>
                Snap AI is designed to help you move from idea to image without
                a messy stack of tools. We keep the workflow tight, the
                interface calm, and the output easy to manage.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={motionEnabled ? fadeUp : undefined}
            className='relative'>
            <div className='absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-300/30 blur-3xl' />
            <Card className='relative overflow-hidden border-border/70 bg-white/85 shadow-xl backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-2xl'>What we care about</CardTitle>
                <CardDescription>
                  Keep the product practical, polished, and easy to trust.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-3'>
                {stats.map(stat => (
                  <div
                    key={stat.label}
                    className='rounded-2xl border border-border/60 bg-slate-50 p-4 text-center'>
                    <div className='text-2xl font-semibold text-slate-950'>
                      {stat.value}
                    </div>
                    <div className='mt-1 text-sm text-slate-500'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <section className='relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28'>
        <motion.div
          className='grid gap-4 md:grid-cols-3'
          variants={motionEnabled ? pageContainer : undefined}
          initial={motionEnabled ? 'hidden' : false}
          whileInView={motionEnabled ? 'show' : undefined}
          viewport={motionEnabled ? { once: true, amount: 0.2 } : undefined}>
          {highlights.map(item => (
            <motion.div
              key={item.title}
              variants={motionEnabled ? fadeUp : undefined}>
              <Card className='h-full border-border/70 bg-white/90 shadow-sm'>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm leading-7 text-slate-600'>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className='relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28'>
        <motion.div
          className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'
          variants={motionEnabled ? pageContainer : undefined}
          initial={motionEnabled ? 'hidden' : false}
          whileInView={motionEnabled ? 'show' : undefined}
          viewport={motionEnabled ? { once: true, amount: 0.25 } : undefined}>
          <motion.div
            variants={motionEnabled ? fadeUp : undefined}
            className='space-y-4'>
            <p className='text-sm font-medium uppercase tracking-[0.24em] text-emerald-700'>
              Our approach
            </p>
            <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              Helpful, animated, and lightweight where it matters.
            </h2>
            <p className='text-base leading-7 text-slate-600'>
              The goal is not to overwhelm you with features. It is to make the
              core image workflow feel fast and intentional, with clean surfaces
              for generation, discovery, and account management.
            </p>
          </motion.div>

          <motion.div
            variants={motionEnabled ? fadeUp : undefined}
            className='grid gap-4 sm:grid-cols-2'>
            <Card className='border-border/70 bg-white/90 shadow-sm'>
              <CardHeader>
                <CardTitle>Simple interface</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm leading-7 text-slate-600'>
                  We keep the chrome clean so the product feels modern without
                  getting heavy.
                </p>
              </CardContent>
            </Card>
            <Card className='border-border/70 bg-white/90 shadow-sm'>
              <CardHeader>
                <CardTitle>Responsive motion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm leading-7 text-slate-600'>
                  Small, meaningful transitions help pages feel alive without
                  becoming distracting.
                </p>
              </CardContent>
            </Card>
            <Card className='border-border/70 bg-white/90 shadow-sm sm:col-span-2'>
              <CardHeader>
                <CardTitle>Brand consistency</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center gap-4'>
                <Image
                  src='/logo.png'
                  alt='Snap AI logo'
                  width={56}
                  height={56}
                  className='rounded-2xl'
                />
                <p className='text-sm leading-7 text-slate-600'>
                  We use the same logo, color, and spacing language across the
                  site so the experience feels connected from the homepage to
                  billing.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
