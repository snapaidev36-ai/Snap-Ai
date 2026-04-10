'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuthStore } from '@/lib/store/auth-store';

const Hero: React.FC = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);

  const primaryActionLabel = initialized
    ? user
      ? 'Dashboard'
      : 'Start now'
    : 'Loading...';

  function handlePrimaryAction() {
    if (!initialized) {
      return;
    }

    router.push(user ? '/dashboard' : '/login');
  }

  return (
    <div className='w-full text-center py-8'>
      {/* Header section */}
      <div className='flex justify-center mb-4'>
        <div className='rounded-full w-11 h-11 bg-[rgb(197_255_103/var(--tw-bg-opacity,1))] flex items-center justify-center'>
          <Image
            src='/icons/star-06.svg'
            alt='Star Icon'
            width={24}
            height={24}
          />
        </div>
        <div className='rounded-full h-11 bg-[#F1F1F1] flex items-center justify-center px-8'>
          <h1 className='text-sm font-semibold'>Snap-Ai Generator</h1>
        </div>
      </div>

      {/* Main heading */}
      <h2
        className='font-bold text-3xl leading-[1.3] lg:text-4xl xl:text-[3.5rem] lg:leading-[1.3] xl:leading-[1.2] max-w-2xl xl:max-w-4xl mx-auto'
        dangerouslySetInnerHTML={{
          __html:
            'Turn Your Images into Stunning Art with <span class="inline-block mt-1 ml-1 lg:ml-2 border border-solid border-green-500 leading-none pb-2 pt-0.5 lg:pb-3 lg:pt-1 px-3 relative"><span>AI Magic</span></span> Touch!',
        }}
      />

      {/* Description */}
      <p className='mt-2 lg:mt-6 xl:mt-6 text-gray-600 dark:text-gray-300 max-w-[764px] mx-auto lg:text-base lg:leading-6 xl:text-lg leading-relaxed'>
        Harness artistic self-expression to turn selfies into captivating art.
        Stand out, redefine your brand, and let <strong>Snap-ai</strong>{' '}
        generation guide you.
      </p>

      {/* Buttons */}
      <div className='flex gap-2 justify-center mt-6 lg:mt-8 xl:mt-10 relative z-10'>
        <Button
          onClick={handlePrimaryAction}
          disabled={!initialized}
          className='h-10 w-40 font-bold'>
          {primaryActionLabel}
        </Button>
        <Button
          onClick={() => console.log('Navigate to create AI image page')}
          className='h-10 bg-black w-40 font-bold text-white'>
          Create AI Image
        </Button>
      </div>

      {/* Image grid */}
      <div className='grid lg:grid-cols-[250px_auto_250px] xl:grid-cols-[300px_auto_300px] gap-4 mt-6 lg:-mt-10 xl:-mt-20 max-w-[1400px] mx-auto px-4 md:px-8'>
        <div className='grid grid-cols-12 lg:flex lg:flex-col gap-4'>
          <div className='col-span-6 h-[200px] md:h-[300px] rounded-4xl relative overflow-hidden'>
            <Image
              src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-left-01_dvzw0w.jpg'
              className='object-cover absolute top-0 left-0 w-full h-full'
              width={300}
              height={400}
              alt=''
            />
          </div>
          <div className='col-span-6 h-[200px] md:h-[300px] rounded-4xl relative overflow-hidden'>
            <Image
              src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-left-02_ty5vso.jpg'
              className='object-cover absolute top-0 left-0 w-full h-full'
              width={300}
              height={400}
              alt=''
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4 lg:items-stretch xl:items-end lg:pt-20 xl:pt-0'>
          <div className='hidden lg:grid grid-cols-12 xl:hidden col-span-12 xl:col-span-4 gap-4'>
            <div className='col-span-6'>
              <div className='relative rounded-4xl h-full overflow-hidden'>
                <Image
                  src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-center-01_exag1a.jpg'
                  className='object-cover absolute top-0 left-0 w-full h-full'
                  width={467}
                  height={891}
                  sizes='245px'
                  alt=''
                />
              </div>
            </div>
            <div className='col-span-6'>
              <div className='relative rounded-4xl lg:h-full xl:h-[232px] overflow-hidden'>
                <Image
                  src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090593/AI%20Suite/ai-hero-image-center-02_mzld7v.jpg'
                  className='object-cover absolute top-0 left-0 w-full h-full'
                  sizes='506px'
                  width={1028}
                  height={464}
                  alt=''
                />
              </div>
            </div>
          </div>
          <div className='hidden lg:grid grid-cols-12 gap-4 col-span-12 xl:hidden'>
            <div className='col-span-6'>
              <div className='relative rounded-4xl! h-full overflow-hidden'>
                <Image
                  src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-center-03_zvh4v4.jpg'
                  className='object-cover absolute top-0 left-0 w-full h-full'
                  sizes='245px'
                  width={502}
                  height={464}
                  alt=''
                />
              </div>
            </div>
            <div className='col-span-6'>
              <div className='relative rounded-4xl! h-full overflow-hidden'>
                <Image
                  src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090593/AI%20Suite/ai-hero-image-center-04_ichuco.jpg'
                  className='object-cover absolute top-0 left-0 w-full h-full'
                  sizes='245px'
                  width={502}
                  height={464}
                  alt=''
                />
              </div>
            </div>
          </div>
          <div className='lg:hidden xl:block col-span-12 sm:col-span-4 xl:col-span-4'>
            <div className='relative rounded-4xl h-[200px] sm:h-[476px] overflow-hidden'>
              <Image
                src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-center-01_exag1a.jpg'
                className='object-cover absolute top-0 left-0 w-full h-full'
                sizes='245px'
                width={467}
                height={891}
                alt=''
              />
            </div>
          </div>
          <div className='flex col-span-12 lg:hidden xl:flex sm:col-span-8 xl:col-span-8 flex-col gap-4'>
            <div className='relative rounded-4xl  h-[200px] sm:h-[232px] overflow-hidden zzz'>
              <Image
                src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090593/AI%20Suite/ai-hero-image-center-02_mzld7v.jpg'
                className='object-cover absolute top-0 left-0 w-full h-full'
                sizes='506px'
                width={1028}
                height={464}
                alt=''
              />
            </div>
            <div className='grid grid-cols-12 gap-4 '>
              <div className='col-span-6'>
                <div className='relative rounded-4xl! h-[200px] sm:h-[232px] overflow-hidden'>
                  <Image
                    src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090594/AI%20Suite/ai-hero-image-center-03_zvh4v4.jpg'
                    className='object-cover absolute top-0 left-0 w-full h-full'
                    sizes='245px'
                    width={502}
                    height={464}
                    alt=''
                  />
                </div>
              </div>
              <div className='col-span-6'>
                <div className='relative rounded-4xl! h-[200px] sm:h-[232px] overflow-hidden'>
                  <Image
                    src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090593/AI%20Suite/ai-hero-image-center-04_ichuco.jpg'
                    className='object-cover absolute top-0 left-0 w-full h-full'
                    sizes='245px'
                    width={502}
                    height={464}
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-12 lg:flex flex-col gap-4'>
          <div className='col-span-6 h-[200px] md:h-[300px] rounded-4xl relative overflow-hidden'>
            <Image
              src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734090593/AI%20Suite/ai-hero-image-right-01_zwke6n.jpg'
              className='object-cover absolute top-0 left-0 w-full h-full'
              sizes='300px'
              width={600}
              height={600}
              alt=''
            />
          </div>
          <div className='col-span-6 h-[200px] md:h-[300px] rounded-4xl relative overflow-hidden'>
            <Image
              src='https://res.cloudinary.com/da2yfyikz/image/upload/v1734093990/AI%20Suite/ai-hero-image-right-02_d7evrm.jpg'
              className='object-cover absolute top-0 left-0 w-full h-full'
              sizes='300px'
              width={600}
              height={600}
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
