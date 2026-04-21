'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Download } from '@/lib/icons';
import { useAuthStore } from '@/lib/store/auth-store';

const Hero: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);

  const handleDownload = async (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    link.click();
  };

  const images = Array.from({ length: 25 }, (_, i) => `/discover/${i + 1}.png`);

  return (
    <div className='w-full pt-5 '>
      {/* HERO */}
      <section className='relative w-full'>
        <Image
          src='/discover/discover-hero.png'
          width={1920}
          height={900}
          alt='Hero'
          priority
          className='w-full h-auto'
        />

        <div className='absolute hidden inset-0 lg:flex items-start'>
          <div className='max-w-325 mx-auto w-full px-4'>
            <div className='max-w-xl'>
              <h1 className='md:text-[32px] md:leading-7.5 lg:leading-13.75 md:pt-14 lg:pt-0 lg:text-6xl font-bold text-black'>
                Unlock the World of <br className='hidden md:flex' />{' '}
                AI-Generated Art
              </h1>
              <p className='hidden lg:flex mt-1 lg:mt-4 text-[15px] xl:text-2xl font-normal text-gray-500'>
                Explore an endless, AI-generated images for every need.
              </p>
              {initialized ? (
                <Button
                  asChild
                  className='bg-primary hover:brightness-95 w-40 mx-auto min-[600px]:mx-0 font-bold mt-5 md:mt-[4vw] xl:mt-[3vw]'>
                  <Link href={user ? '/dashboard' : '/login'}>
                    Start Discovering
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className='bg-primary hover:brightness-95 w-40 mx-auto min-[600px]:mx-0 font-bold mt-5 md:mt-[4vw] xl:mt-[3vw]'>
                  Loading...
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className='mt-14'>
        <div className='text-center mb-10'>
          <h2 className='text-2xl lg:text-3xl font-bold'>Explore Gallery</h2>
          <p className='text-gray-500 mt-2'>Discover AI-generated creations</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 max-w-325 mx-auto'>
          {images.map((src, index) => (
            <div
              key={index}
              className='group relative w-full aspect-square overflow-hidden rounded-xl'>
              <Image
                src={src}
                alt={`Gallery ${index + 1}`}
                fill
                className='object-cover hover:scale-105 transition-transform duration-300'
              />

              <button
                onClick={() => handleDownload(src)}
                className='absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition'>
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
