'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { sections } from '@/constants';
import { Button } from '../ui/button';
import {
  fadeUp,
  sectionContainer,
  slideInLeft,
  slideInRight,
} from '@/lib/motion/variants';

const LandingPageTools: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <section className='w-full text-center mx-auto lg:px-0 space-y-12 py-8'>
      {sections?.length ? (
        sections.map((section, index) => {
          const isReverse = section.imageOrder === 'reverse';
          const textVariants = isReverse ? slideInRight : slideInLeft;
          const imageVariants = isReverse ? slideInLeft : slideInRight;

          return (
            <div key={index} className='relative mb-12 md:mb-0'>
              <div className='max-w-274 mx-auto px-4 md:px-8'>
                <div
                  className={`flex flex-col md:flex-row items-center gap-8 mb-10 md:mb-20 last:mb-0 ${
                    isReverse ? 'md:flex-row-reverse' : ''
                  }`}>
                  <motion.div
                    className={`w-full md:w-1/2 text-left ${
                      index === 1 ? 'md:pl-16' : ''
                    }`}
                    initial={motionEnabled ? 'hidden' : false}
                    whileInView={motionEnabled ? 'show' : undefined}
                    viewport={
                      motionEnabled ? { once: true, amount: 0.35 } : undefined
                    }
                    variants={motionEnabled ? textVariants : undefined}>
                    <motion.div
                      className='space-y-0'
                      variants={motionEnabled ? sectionContainer : undefined}>
                      <motion.h2
                        className={`inline-block relative z-10 text-xl sm:text-2xl lg:text-[2rem] font-bold leading-8 md:leading-10 mb-3 ${
                          index === 0 || index === 2 ? 'lg:w-105' : ''
                        }`}
                        variants={motionEnabled ? fadeUp : undefined}>
                        {section.title}
                      </motion.h2>

                      <motion.p
                        className='font-normal text-base leading-relaxed theme-grayTextColor lg:w-105 mb-6 md:mb-12'
                        variants={motionEnabled ? fadeUp : undefined}>
                        {section.description}
                      </motion.p>

                      <motion.div variants={motionEnabled ? fadeUp : undefined}>
                        <Button onClick={() => console.log('Navigate to')}>
                          {section.buttonText}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className='w-full md:w-1/2 relative'
                    initial={motionEnabled ? 'hidden' : false}
                    whileInView={motionEnabled ? 'show' : undefined}
                    viewport={
                      motionEnabled ? { once: true, amount: 0.35 } : undefined
                    }
                    variants={motionEnabled ? imageVariants : undefined}>
                    <Image
                      src={section.imageSrc}
                      alt={section.title}
                      width={500}
                      height={300}
                      className='w-full rounded-[30px] relative z-5 order-1 md:order-2'
                    />

                    <div
                      className={`absolute top-0 z-0 ${
                        index % 2 === 0
                          ? 'right-full translate-x-1/2'
                          : 'left-full -translate-x-1/2'
                      }`}></div>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className='text-gray-500'>No tool sections available.</p>
      )}
    </section>
  );
};

export default LandingPageTools;
