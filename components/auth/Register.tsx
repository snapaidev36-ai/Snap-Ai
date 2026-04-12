'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import AuthShell from '@/components/auth/AuthShell';

export default function Register() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
