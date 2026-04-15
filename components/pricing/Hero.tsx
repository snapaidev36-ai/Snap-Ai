'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
  const router = useRouter();

  const isAuth = false; // hardcoded (change for testing)

  const handleClick = () => {
    if (isAuth) {
      router.push('/dashboard');
    } else {
      alert('Redirect to login modal');
    }
  };

  return (
    <div className='w-full pt-24 pb-10 lg:pt-0 px-4 md:px-8 xl:px-0'>
      <section>
        <div className='mx-auto flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-16'>
          {/* LEFT CONTENT */}
          <div className='max-w-141.75 relative z-10'>
            <h1 className='font-bold text-3xl leading-[1.3] lg:text-4xl xl:text-[3.5rem] lg:leading-[1.2] xl:leading-[1.1] max-w-2xl xl:max-w-4xl mx-auto text-center min-[600px]:text-left'>
              Simple, transparent pricing for everyone
            </h1>

            <p className='mt-2 xl:mt-6 text-gray-500 max-w-60 min-[600px]:max-w-191 mx-auto lg:text-base lg:leading-6 xl:text-lg leading-relaxed min-[600px]:pr-32 xl:pr-16 text-center min-[600px]:text-left'>
              Choose a plan that fits your creative needs
            </p>

            <button
              onClick={handleClick}
              className='block h-12 bg-purple-600 text-white hover:opacity-90 rounded-full min-w-40 px-4 mx-auto min-[600px]:mx-0 font-bold mt-8 md:mt-[4vw] xl:mt-[3vw]'>
              Get Started Now
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <Image
              src='https://res.cloudinary.com/da2yfyikz/image/upload/v1737454184/AI%20Suite/pricing-hero-v2_u3m9jc.png'
              width={616}
              height={498}
              alt='Pricing Illustration'
            />
          </div>
        </div>
      </section>

      {/* STATIC EXTRA SECTION (replacing dynamic components) */}
      <section className='mt-10 lg:mt-16 text-center'>
        <h2 className='text-2xl font-semibold mb-4'>
          Flexible Plans for Everyone
        </h2>
        <p className='text-gray-500 max-w-xl mx-auto'>
          Upgrade anytime and unlock more powerful AI features to boost your
          productivity.
        </p>
      </section>
    </div>
  );
};

export default Hero;
