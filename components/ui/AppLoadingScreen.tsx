import Image from 'next/image';

type AppLoadingScreenProps = {
  message?: string;
};

export default function AppLoadingScreen({
  message = 'Loading...',
}: AppLoadingScreenProps) {
  return (
    <main className='min-h-dvh bg-slate-50 px-4'>
      <div className='mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-4'>
        <Image src='/logo.png' alt='Snap AI' width={70} height={70} priority />
        <p className='text-sm font-medium text-slate-500'>{message}</p>
      </div>
    </main>
  );
}
