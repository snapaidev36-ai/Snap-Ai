import Image from 'next/image';

type AppLoadingScreenProps = {
  message?: string;
};

export default function AppLoadingScreen({
  message = 'Loading...',
}: AppLoadingScreenProps) {
  return (
    <main className='min-h-screen bg-slate-50 px-4'>
      <div className='mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4'>
        <Image
          src='/snap-logo-4.png'
          alt='Snap AI'
          width={170}
          height={80}
          priority
          className='h-auto w-[140px] sm:w-[170px]'
        />
        <p className='text-sm font-medium text-slate-500'>{message}</p>
      </div>
    </main>
  );
}
