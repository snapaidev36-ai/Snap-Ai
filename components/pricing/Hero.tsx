'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  ChevronRight,
  LayoutDashboard,
  Send,
  Sparkles,
  Users,
} from '@/lib/icons';
import {
  fadeUp,
  pageContainer,
  sectionContainer,
  slideInLeft,
  slideInRight,
} from '@/lib/motion/variants';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '../ui/button';

const Hero: React.FC = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  const handleClick = () => {
    if (!initialized) {
      return;
    }
    router.push(user ? '/dashboard' : '/login');
  };

  const heroStats = [
    { label: 'Plans', value: '3 tiers' },
    { label: 'Checkout', value: 'Stripe' },
    { label: 'Access', value: 'Instant' },
  ];

  const trustPoints = [
    {
      icon: LayoutDashboard,
      title: 'Clear plan comparison',
      text: 'See exactly what each tier includes before you buy.',
    },
    {
      icon: Users,
      title: 'Built for teams and solo creators',
      text: 'Choose the right plan size without digging through clutter.',
    },
    {
      icon: Send,
      title: 'Fast handoff to checkout',
      text: 'Move directly into purchase flow when you are ready.',
    },
  ];

  return (
    <motion.div
      className='relative w-full overflow-hidden px-4 pb-10 pt-20 md:px-8 lg:pt-10 xl:px-0'
      variants={motionEnabled ? pageContainer : undefined}
      initial={motionEnabled ? 'hidden' : false}
      animate={motionEnabled ? 'show' : undefined}>
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-144 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.04),transparent_62%)]' />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -left-32 top-28 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl'
        animate={motionEnabled ? { x: [0, 18, 0], y: [0, -10, 0] } : undefined}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -right-40 top-44 -z-10 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl'
        animate={motionEnabled ? { x: [0, -16, 0], y: [0, 12, 0] } : undefined}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className='mx-auto w-full max-w-7xl'>
        <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
          <motion.div variants={motionEnabled ? slideInLeft : undefined}>
            <div className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur'>
              <Sparkles size={16} className='text-emerald-600' />
              Transparent pricing for every stage
            </div>

            <h1 className='mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]'>
              Simple, professional pricing that feels easy to trust.
            </h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
              Compare plans quickly, understand what you get, and move straight
              to checkout when the right tier is clear.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Button
                type='button'
                onClick={handleClick}
                disabled={!initialized}
                className='inline-flex cursor-pointer items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800'>
                Get Started Now
                <ChevronRight size={16} />
              </Button>

              <Button
                type='button'
                onClick={() => router.push('#plans')}
                className='inline-flex items-center justify-center border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50'>
                See plans below
              </Button>
            </div>

            <motion.dl
              className='mt-10 grid gap-4 sm:grid-cols-3'
              variants={motionEnabled ? sectionContainer : undefined}>
              {heroStats.map(stat => (
                <motion.div
                  key={stat.label}
                  variants={motionEnabled ? fadeUp : undefined}
                  className='rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur'>
                  <dt className='text-sm text-slate-500'>{stat.label}</dt>
                  <dd className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            variants={motionEnabled ? slideInRight : undefined}
            className='relative'>
            <div className='absolute -inset-4 rounded-4xl bg-linear-to-br from-emerald-500/10 via-sky-500/10 to-purple-500/10 blur-2xl' />
            <motion.div
              className='relative overflow-hidden rounded-4xl border border-white/70 bg-white/85 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl'
              whileHover={motionEnabled ? { y: -6 } : undefined}
              transition={{ duration: 0.28, ease: 'easeOut' }}>
              <div className='relative overflow-hidden rounded-[1.75rem]'>
                <Image
                  src='https://res.cloudinary.com/da2yfyikz/image/upload/v1737454184/AI%20Suite/pricing-hero-v2_u3m9jc.png'
                  width={616}
                  height={498}
                  alt='Pricing Illustration'
                  className='h-auto w-full object-cover'
                  priority
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent' />
                <div className='absolute left-4 right-4 top-4 flex items-center justify-between gap-3'>
                  <span className='rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur'>
                    Pricing overview
                  </span>
                  <span className='rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur'>
                    Live comparison
                  </span>
                </div>
                <div className='absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-2xl border border-white/15 bg-white/10 p-4 text-white/90 backdrop-blur'>
                    <p className='text-xs uppercase tracking-[0.22em] text-white/65'>
                      Best for
                    </p>
                    <p className='mt-1 text-lg font-semibold'>
                      Creators who want clarity
                    </p>
                  </div>
                  <div className='rounded-2xl border border-white/15 bg-white/10 p-4 text-white/90 backdrop-blur'>
                    <p className='text-xs uppercase tracking-[0.22em] text-white/65'>
                      Next step
                    </p>
                    <p className='mt-1 text-lg font-semibold'>
                      Choose a plan below
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className='mx-auto mt-12 grid w-full max-w-7xl gap-4 rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:grid-cols-3 sm:p-8'
        variants={motionEnabled ? sectionContainer : undefined}>
        {trustPoints.map(point => {
          const Icon = point.icon;

          return (
            <motion.div
              key={point.title}
              variants={motionEnabled ? fadeUp : undefined}
              className='rounded-2xl border border-slate-200 bg-slate-50/80 p-5'>
              <Icon size={18} className='text-emerald-600' />
              <h2 className='mt-4 text-base font-semibold text-slate-950'>
                {point.title}
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                {point.text}
              </p>
            </motion.div>
          );
        })}
      </motion.section>
    </motion.div>
  );
};

export default Hero;
