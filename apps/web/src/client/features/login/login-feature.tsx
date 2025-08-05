'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import type { z } from 'zod';
import FormInput from '@/client/features/common/components/atoms/form-input';
import { Button } from '@/client/features/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import { Form } from '@/client/features/common/components/ui/form';
import { cn } from '@/client/lib/utils';
import { login } from '@/common/actions/supabase/actions';
import { loginSchema } from '@/common/actions/supabase/schema';
import logger from '@/logger';

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFeature = () => {
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setIsLoading(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      // Add redirect parameter if it exists
      if (redirectTo) {
        formData.append('redirectTo', redirectTo);
      }

      const result = await login({}, formData);

      if (result?.error) {
        setServerError(result.error);
      }
    } catch (error) {
      logger.error('Login failed:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex w-1/3 flex-col gap-6')}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            {redirectTo === '/admin' 
              ? 'Please login to access the admin panel'
              : 'Enter your email below to login to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormInput
                form={form}
                label="Email"
                name="email"
                placeholder="m@example.com"
                type="email"
              />

              <div className="space-y-2">
                <FormInput
                  form={form}
                  label="Password"
                  labelSuffix={
                    <a
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      href="/forgot-password"
                    >
                      Forgot your password?
                    </a>
                  }
                  name="password"
                  placeholder=""
                  type="password"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <a className="underline underline-offset-4" href="/signup">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginFeature;
