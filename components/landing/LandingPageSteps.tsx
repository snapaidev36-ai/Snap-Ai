'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { steps } from '@/constants';
import { fadeUp, sectionContainer } from '@/lib/motion/variants';

const LandingPageSteps: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <motion.section
      className='w-full max-w-274 mx-auto px-4 md:px-8 xl:px-0 py-8'
      initial={motionEnabled ? 'hidden' : false}
      whileInView={motionEnabled ? 'show' : undefined}
      viewport={motionEnabled ? { once: true, amount: 0.35 } : undefined}
      variants={motionEnabled ? sectionContainer : undefined}>
      <motion.h2
        className='mb-8 xl:mb-12 mt-0 font-bold text-2xl xl:text-[2rem] text-center'
        variants={motionEnabled ? fadeUp : undefined}>
        How to Create in 3 Easy Steps!
      </motion.h2>

      <motion.div
        className='grid grid-cols-12 w-full gap-4'
        variants={motionEnabled ? sectionContainer : undefined}>
        {steps?.length ? (
          steps.map((step, index) => (
            <motion.div
              key={index}
              className='bg-(--color-light-gray) col-span-12 md:col-span-4 rounded-4xl'
              variants={motionEnabled ? fadeUp : undefined}>
              <div className='p-5 flex flex-col min-[519px]:flex-row md:flex-col h-full gap-6'>
                <div className='basis-1/2'>
                  <div className='w-9 h-9 lg:h-12 lg:w-12 bg-[#e7e7e7] rounded-full flex justify-center items-center text-base font-bold'>
                    {index + 1}
                  </div>
                  <h3 className='text-xl font-bold mt-3 xl:mt-5 leading-tight'>
                    {step.title}
                  </h3>
                  <p className='theme-lightText mt-2 lg:mt-3'>
                    {step.description}
                  </p>
                </div>

                <div className='relative w-full basis-1/2 flex'>
                  <Image
                    src={step.imageSrc}
                    className='w-full h-min self-end'
                    width={332}
                    height={155}
                    alt={`Step ${index + 1} illustration`}
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className='col-span-12 text-center text-gray-500'
            variants={motionEnabled ? fadeUp : undefined}>
            No steps to display.
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
};

export default LandingPageSteps;
