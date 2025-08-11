import type { JSX } from 'react';
import LoginFeature from '@/client/features/login/login-feature';

type Search = { [key: string]: string | string[] | undefined };

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<Search>;
}): Promise<JSX.Element> => {
  const sp = await searchParams;
  const redirectTo = typeof sp.redirectTo === 'string' ? sp.redirectTo : '';

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LoginFeature redirectTo={redirectTo} />
    </div>
  );
};

export default LoginPage;
