import Link from 'next/link';

import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { verifyEmailVerificationToken } from '@/lib/auth/email-verification';

type VerifyEmailPageProps = {
  searchParams?: Promise<{ token?: string } | { token?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const token = params.token ?? '';

  let title = 'Verify your email';
  let description =
    'Open the link in your inbox to verify your Snap AI account.';
  let bodyText = 'The verification link is missing or invalid.';
  let isSuccess = false;

  if (token) {
    const verifiedUser = await verifyEmailVerificationToken(token);

    if (verifiedUser) {
      title = 'Email verified';
      description = `Thanks ${verifiedUser.firstName}. Your account is ready to use.`;
      bodyText = 'You can sign in now using your email and password.';
      isSuccess = true;
    } else {
      title = 'Verification link unavailable';
      description =
        'This verification link is invalid or has already been used.';
      bodyText =
        'If you still need access, register again with the same email.';
    }
  }

  return (
    <AuthShell>
      <Card className='w-full border-border/60 bg-background/95 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>{bodyText}</p>

          {isSuccess ? (
            <Button asChild className='w-full sm:w-auto'>
              <Link href='/login?verified=1'>Go to login</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
