'use client';

import { Toaster as SonnerToaster, toast, type ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      richColors
      closeButton
      position='top-right'
      toastOptions={{
        classNames: {
          toast: 'border border-border bg-background text-foreground shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
