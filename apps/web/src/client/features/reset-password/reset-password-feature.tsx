'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { createClient as createSupabaseClient } from '@/client/utils/supabase-client';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordFeature = (): JSX.Element => {
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | undefined>(
    undefined
  );
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  useEffect((): (() => void) | undefined => {
    if (typeof window === 'undefined') {
      return;
    }

    const supabase = createSupabaseClient();
    const hash = window.location.hash ?? '';
    const params = new URLSearchParams(
      hash.startsWith('#') ? hash.slice(1) : hash
    );
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    const cleanUrl = () => {
      if (window.location.hash) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search
        );
      }
    };

    const init = async () => {
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          setSessionError(error.message);
        }
      }
      const { data } = await supabase.auth.getSession();
      setReady(Boolean(data.session));
      cleanUrl();
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // do nothing
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (values: FormValues): Promise<void> => {
    setSubmitError(undefined);
    setPending(true);
    const supabase = createSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    setPending(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push('/login');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormInput
                form={form}
                label="New Password"
                name="password"
                placeholder=""
                type="password"
              />
              <FormInput
                form={form}
                label="Confirm Password"
                name="confirmPassword"
                placeholder=""
                type="password"
              />
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  disabled={pending || !ready}
                  type="submit"
                >
                  {pending ? 'Updating...' : 'Update password'}
                </Button>
                {!ready && (
                  <p className="text-sm">Preparing your reset session…</p>
                )}
                {(sessionError || submitError) && (
                  <p className="text-red-500 text-sm">
                    {sessionError ?? submitError}
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordFeature;
