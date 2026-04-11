'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { pageContainer, slideInLeft, slideInRight } from '@/lib/motion/variants';
import RegisterForm from '@/components/auth/RegisterForm';

export default function Register() {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <div className='min-h-dvh flex items-center justify-center'>
      <div className='w-full max-w-6xl px-4 md:px-6 lg:px-6'>
        <motion.div
          className='grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 items-stretch lg:justify-items-center'
          variants={motionEnabled ? pageContainer : undefined}
          initial={motionEnabled ? 'hidden' : false}
          animate={motionEnabled ? 'show' : undefined}>
          {/* LEFT HERO SECTION */}
          <motion.div
            className='hidden lg:flex h-full min-h-0 w-full max-w-xl'
            variants={motionEnabled ? slideInLeft : undefined}>
            {/* Hero Content */}
            <div className='flex-1 flex h-full flex-col justify-center'>
              <div className='relative h-full w-full overflow-hidden rounded-md'>
                <Image
                  src='/login-img.png'
                  alt='Platform illustration'
                  fill
                  sizes='(min-width: 1024px) 50vw, 80vw'
                  className='object-cover'
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM SECTION */}
          <motion.div
            className='py-12 md:py-0'
            variants={motionEnabled ? slideInRight : undefined}>
            <RegisterForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
