'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormInput from '@/client/features/common/components/atoms/FormInput';
import { Button } from '@/client/features/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import { Form } from '@/client/features/common/components/ui/form';
import {
  type ForgotPasswordState,
  forgotPassword,
} from '@/common/actions/supabase/actions';

const formSchema = z.object({
  email: z.email({ message: 'Invalid email address.' }),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: ForgotPasswordState = {};

const ForgotPasswordFeature = () => {
  const [state, formAction, pending] = useActionState(
    forgotPassword,
    initialState
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  if (state?.success) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Check your email</CardTitle>
            <CardDescription>{state.success}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-6">
              <FormInput
                form={form}
                label="Email"
                name="email"
                placeholder="m@example.com"
                state={state}
                type="email"
              />

              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={pending} type="submit">
                  {pending ? 'Sending...' : 'Send reset link'}
                </Button>
                {state?.serverError && (
                  <p className="text-red-500 text-sm">{state.serverError}</p>
                )}
              </div>

              <div className="text-center text-sm">
                Remember your password?{' '}
                <Link className="underline underline-offset-4" href="/login">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordFeature;
