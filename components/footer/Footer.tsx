'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { socialLinks } from '@/constants';
import { fadeUp, sectionContainer } from '@/lib/motion/variants';

interface FooterProps {
  ImageTools?: { name: string }[];
}

type FooterSocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

const Footer: React.FC<FooterProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  const footerCardRef = useRef<HTMLDivElement | null>(null);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  const socialLinkItems: FooterSocialLink[] = Array.isArray(socialLinks)
    ? socialLinks
    : Object.values(socialLinks ?? {});

  const paymentIcons: { key: string; icon: React.ReactNode }[] = [
    {
      key: 'mastercard',
      icon: '/icons/MasterCard.svg',
    },
  ];

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = footerCardRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    setPointerPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  return (
    <motion.footer
      className='relative w-full overflow-hidden border-t border-border/60 bg-[radial-gradient(circle_at_top,rgba(197,255,103,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1),rgba(247,248,250,1))] dark:bg-[radial-gradient(circle_at_top,rgba(197,255,103,0.12),transparent_24%),linear-gradient(180deg,rgba(10,10,12,0.98),rgba(15,15,18,1))]'
      initial={motionEnabled ? 'hidden' : false}
      whileInView={motionEnabled ? 'show' : undefined}
      viewport={motionEnabled ? { once: true, amount: 0.2 } : undefined}
      variants={motionEnabled ? sectionContainer : undefined}>
      <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent' />
      <div className='absolute -left-24 top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl' />
      <div className='absolute -right-16 bottom-4 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16'>
        <motion.div
          ref={footerCardRef}
          className='overflow-hidden rounded-4xl border border-border/70 bg-background/80 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5'
          onPointerEnter={event => {
            setIsPointerInside(true);
            handlePointerMove(event);
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setIsPointerInside(false)}
          variants={motionEnabled ? sectionContainer : undefined}>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out'
            style={{
              opacity: isPointerInside ? 1 : 0,
              backgroundImage: `radial-gradient(circle 280px at ${pointerPosition.x}px ${pointerPosition.y}px, rgba(197, 255, 103, 0.24), transparent 65%), radial-gradient(circle 180px at ${pointerPosition.x}px ${pointerPosition.y}px, rgba(255, 255, 255, 0.32), transparent 68%)`,
            }}
          />

          <div className='grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-10'>
            <motion.div
              className='relative z-10 space-y-5'
              variants={motionEnabled ? fadeUp : undefined}>
              <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                AI image studio
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Link href='/' className='shrink-0'>
                    <Image
                      src='/logo.png'
                      width={48}
                      height={48}
                      alt='Snap AI logo'
                      className='h-12 w-12 rounded-2xl shadow-sm'
                    />
                  </Link>
                  <div>
                    <p className='text-lg font-semibold tracking-tight'>
                      Snap AI
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Modern image generation for creators, teams, and brands.
                    </p>
                  </div>
                </div>

                <p className='text-muted-foreground max-w-md text-sm leading-6 sm:text-base'>
                  Create polished visuals, explore new styles, and keep your
                  workflow moving with a fast, carefully animated interface.
                </p>
              </div>
            </motion.div>

            <motion.div
              className='relative z-10 space-y-5'
              variants={motionEnabled ? fadeUp : undefined}>
              <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                Payments & Social
              </h4>

              <div className='space-y-4 rounded-2xl border border-border/70 bg-muted/30 p-4'>
                <div className='space-y-3'>
                  <p className='text-sm font-semibold'>Secure payments</p>
                  <div className='flex flex-wrap gap-3'>
                    {paymentIcons.map(({ key, icon }) => (
                      <div
                        key={key}
                        className='flex h-10 items-center rounded-xl border border-border/70 bg-background px-3 shadow-sm'>
                        <Image
                          src={icon as string}
                          width={96}
                          height={28}
                          alt='payment methods'
                          className='h-6 w-auto'
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {socialLinkItems.length ? (
                  <div className='space-y-3'>
                    <p className='text-sm font-semibold'>Follow us</p>
                    <div className='flex flex-wrap gap-2'>
                      {socialLinkItems.map(link => {
                        const SocialIcon = link.icon;

                        return (
                          <motion.div
                            key={link.name}
                            whileHover={
                              motionEnabled ? { y: -2, scale: 1.02 } : undefined
                            }
                            whileTap={
                              motionEnabled ? { scale: 0.98 } : undefined
                            }>
                            <Link
                              href={link.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label={link.name}
                              className='group inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-background px-3 pr-4 text-sm font-medium shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary'>
                              <SocialIcon size={16} className='shrink-0' />
                              <span>{link.name}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>

          <motion.div
            className='relative z-10 border-t border-border/70 px-6 py-5 sm:px-8 lg:px-10'
            variants={motionEnabled ? sectionContainer : undefined}>
            <div className='flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
              <motion.small
                variants={motionEnabled ? fadeUp : undefined}
                className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                <span className='font-medium text-foreground'>Snap AI</span>
                <span>•</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </motion.small>

              <motion.div
                className='flex flex-wrap items-center gap-3'
                variants={motionEnabled ? sectionContainer : undefined}>
                <Link
                  href='/terms-of-service'
                  className='transition-colors hover:text-primary'>
                  Terms
                </Link>
                <Link
                  href='/privacy-policy'
                  className='transition-colors hover:text-primary'>
                  Privacy
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
