import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuthShell from '@/components/auth/AuthShell';
import UpdatePasswordForm from '@/components/account/UpdatePasswordForm';

type UpdatePasswordPageProps = {
  searchParams?: Promise<{ token?: string } | { token?: string }>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const params = (await searchParams) ?? {};
  const token = params.token ?? '';

  return (
    <main>
      <AuthShell>
        {token ? (
          <UpdatePasswordForm token={token} />
        ) : (
          <Card className='w-full shadow-lg'>
            <CardHeader>
              <CardTitle>Update password</CardTitle>
              <CardDescription>
                Open the link from your email to continue changing your
                password.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-sm text-red-600'>
              The password update link is missing or invalid.
            </CardContent>
          </Card>
        )}
      </AuthShell>
    </main>
  );
}
