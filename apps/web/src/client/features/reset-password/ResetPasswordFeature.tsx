'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  type ResetPasswordState,
  resetPassword,
} from '@/common/actions/supabase/actions';

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

const initialState: ResetPasswordState = {};

const ResetPasswordFeature = () => {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-2">
              <FormInput
                form={form}
                label="New Password"
                name="password"
                placeholder=""
                state={state}
                type="password"
              />
              <FormInput
                form={form}
                label="Confirm Password"
                name="confirmPassword"
                placeholder=""
                state={state}
                type="password"
              />

              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={pending} type="submit">
                  {pending ? 'Updating...' : 'Update password'}
                </Button>
                {state?.serverError && (
                  <p className="text-red-500 text-sm">{state.serverError}</p>
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
