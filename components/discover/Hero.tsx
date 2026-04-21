'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui/button';
import { Download, Send, Sparkles } from '@/lib/icons';
import {
  fadeUp,
  pageContainer,
  sectionContainer,
  slideInLeft,
  slideInRight,
} from '@/lib/motion/variants';
import { useAuthStore } from '@/lib/store/auth-store';

const galleryImages = Array.from(
  { length: 25 },
  (_, index) => `/discover/${index + 1}.png`,
);

const heroStats = [
  { label: 'Curated visuals', value: '25' },
  { label: 'Fast downloads', value: '1 tap' },
  { label: 'Editorial feel', value: 'Premium' },
];

const galleryThemes = [
  'Atmospheric study',
  'Cinematic portrait',
  'Gradient concept',
  'Product moodboard',
  'Night scene',
  'Soft surrealism',
];

const previewCards = [
  {
    src: '/discover/discover-hero.png',
    title: 'Featured drop',
    description: 'A refined visual starting point for the latest inspiration.',
    label: 'Hero collection',
  },
  {
    src: '/discover/1.png',
    title: 'Clean compositions',
    description:
      'Balanced layouts with a polished, gallery-first presentation.',
    label: 'Detail card',
  },
  {
    src: '/discover/2.png',
    title: 'Bold lighting',
    description:
      'High-contrast visuals that feel sharp and attention-grabbing.',
    label: 'Mood card',
  },
];

const Hero: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  const handleDownload = async (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    link.click();
  };

  return (
    <motion.div
      className='relative w-full overflow-hidden pt-6 sm:pt-8'
      variants={motionEnabled ? pageContainer : undefined}
      initial={motionEnabled ? 'hidden' : false}
      animate={motionEnabled ? 'show' : undefined}>
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-144 [radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.04),transparent_65%)' />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -right-40 top-24 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl'
        animate={motionEnabled ? { x: [0, -18, 0], y: [0, 12, 0] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -left-36 top-56 -z-10 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl'
        animate={motionEnabled ? { x: [0, 16, 0], y: [0, -12, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center'>
          <motion.div variants={motionEnabled ? slideInLeft : undefined}>
            <div className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur'>
              <Sparkles size={16} className='text-emerald-600' />
              Curated discovery feed
            </div>

            <h1 className='mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.02]'>
              Discover AI art with a polished editorial feel.
            </h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
              Explore a refined collection of generated scenes, prompt ideas,
              and visual studies designed to feel inspiring at a glance.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              {initialized ? (
                <Button
                  asChild
                  size='lg'
                  className='shadow-lg shadow-slate-950/10 transition-transform duration-300 hover:-translate-y-0.5'>
                  <Link href={user ? '/dashboard' : '/login'}>
                    Start Discovering
                    <Send size={16} />
                  </Link>
                </Button>
              ) : (
                <Button
                  size='lg'
                  disabled
                  className='shadow-lg shadow-slate-950/10'>
                  Loading...
                </Button>
              )}

              <Button
                asChild
                size='lg'
                variant='outline'
                className='bg-white/80'>
                <a href='#gallery'>Browse gallery</a>
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
            <div className='absolute -inset-4 rounded-4xl bg-linear-to-br from-emerald-500/10 via-sky-500/10 to-fuchsia-500/10 blur-2xl' />
            <motion.div
              className='relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl'
              whileHover={motionEnabled ? { y: -6 } : undefined}
              transition={{ duration: 0.28, ease: 'easeOut' }}>
              <div className='grid gap-4 md:grid-cols-[1.3fr_0.7fr]'>
                <motion.div
                  className='group relative min-h-96 overflow-hidden rounded-4xl'
                  variants={motionEnabled ? fadeUp : undefined}>
                  <Image
                    src='/discover/discover-hero.png'
                    alt='Featured discover collection'
                    fill
                    priority
                    sizes='(min-width: 1024px) 50vw, 100vw'
                    className='object-cover transition duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-transparent' />
                  <div className='absolute left-5 right-5 top-5 flex items-center justify-between gap-3'>
                    <span className='rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur'>
                      Featured scene
                    </span>
                    <span className='rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur'>
                      Live preview
                    </span>
                  </div>
                  <div className='absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4'>
                    <div className='max-w-md'>
                      <h2 className='text-2xl font-semibold text-white sm:text-3xl'>
                        Motion-rich concepts that feel ready to publish.
                      </h2>
                      <p className='mt-2 max-w-sm text-sm leading-6 text-white/75'>
                        A more refined way to preview AI art before you open the
                        full gallery.
                      </p>
                    </div>
                    <div className='hidden rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right text-xs text-white/75 backdrop-blur md:block'>
                      Updated today
                    </div>
                  </div>
                </motion.div>

                <div className='grid gap-4'>
                  {previewCards.map((card, index) => (
                    <motion.article
                      key={card.title}
                      className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm'
                      variants={motionEnabled ? fadeUp : undefined}
                      whileHover={motionEnabled ? { y: -4 } : undefined}
                      transition={{ duration: 0.24, ease: 'easeOut' }}>
                      <div className='relative aspect-4/3'>
                        <Image
                          src={card.src}
                          alt={card.title}
                          fill
                          sizes='(min-width: 1024px) 22vw, 100vw'
                          className='object-cover transition duration-500 group-hover:scale-[1.04]'
                        />
                        <div className='absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-950/10 to-transparent' />
                        <div className='absolute left-4 right-4 top-4 flex items-center justify-between gap-2'>
                          <span className='rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur'>
                            {card.label}
                          </span>
                          <span className='rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/75 backdrop-blur'>
                            0{index + 1}
                          </span>
                        </div>
                        <div className='absolute bottom-4 left-4 right-4'>
                          <h3 className='text-lg font-semibold text-white'>
                            {card.title}
                          </h3>
                          <p className='mt-1 text-sm leading-6 text-white/75'>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>

              <div className='mt-4 flex flex-wrap gap-3'>
                {heroStats.map(stat => (
                  <span
                    key={stat.label}
                    className='rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600'>
                    {stat.value} {stat.label.toLowerCase()}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        id='gallery'
        className='mx-auto mt-16 w-full max-w-7xl px-4 pb-4 sm:px-6 lg:px-8'>
        <motion.div
          className='flex flex-col gap-4 border-t border-slate-200/70 pt-12 sm:flex-row sm:items-end sm:justify-between'
          variants={motionEnabled ? fadeUp : undefined}>
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600'>
              Explore gallery
            </p>
            <h2 className='mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl'>
              A clean grid that makes each image feel intentional.
            </h2>
            <p className='mt-3 text-slate-600'>
              Subtle motion, stronger hierarchy, and more breathing room make
              the discover page feel like a premium showcase instead of a raw
              feed.
            </p>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm'>
            Tap any image to download it instantly.
          </div>
        </motion.div>

        <motion.div
          className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          variants={motionEnabled ? sectionContainer : undefined}>
          {galleryImages.map((src, index) => (
            <motion.article
              key={src}
              className='group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
              variants={motionEnabled ? fadeUp : undefined}
              whileHover={motionEnabled ? { y: -6 } : undefined}
              transition={{ duration: 0.24, ease: 'easeOut' }}>
              <div className='relative aspect-4/5'>
                <Image
                  src={src}
                  alt={`Gallery piece ${index + 1}`}
                  fill
                  sizes='(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
                  className='object-cover transition duration-500 group-hover:scale-[1.04]'
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-100' />

                <button
                  onClick={() => handleDownload(src)}
                  className='absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100 hover:bg-white/20'>
                  <Download size={16} />
                </button>

                <div className='absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3'>
                  <div>
                    <p className='text-[11px] font-medium uppercase tracking-[0.24em] text-white/65'>
                      Scene {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className='mt-1 text-lg font-semibold text-white'>
                      {galleryThemes[index % galleryThemes.length]}
                    </h3>
                  </div>
                  <span className='rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur'>
                    HD
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Hero;
