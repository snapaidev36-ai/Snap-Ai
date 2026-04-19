'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import AuthShell from '@/components/auth/AuthShell';
import { Card, CardContent } from '@/components/ui/card';

export default function Register() {
  return (
    <AuthShell>
      <Card className='w-full border-border/60 bg-background/95 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm'>
        <CardContent className='p-4 sm:p-6'>
          <RegisterForm />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
