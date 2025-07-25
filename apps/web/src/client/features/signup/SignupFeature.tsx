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
import { type SignupState, signup } from '@/common/actions/supabase/actions';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: SignupState = {};

const SignupFeature = () => {
  const [state, formAction, pending] = useActionState(signup, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  return (
    <div className={'flex w-1/3 flex-col gap-6'}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-6">
              <FormInput
                form={form}
                label="First Name"
                name="firstName"
                placeholder="John"
                state={state}
              />
              <FormInput
                form={form}
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                state={state}
              />
              <FormInput
                form={form}
                label="Email"
                name="email"
                placeholder="m@example.com"
                state={state}
                type="email"
              />
              <FormInput
                form={form}
                label="Password"
                name="password"
                placeholder=""
                state={state}
                type="password"
              />

              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={pending} type="submit">
                  {pending ? 'Creating account...' : 'Create account'}
                </Button>
                {state?.serverError && (
                  <p className="text-red-500 text-sm">{state.serverError}</p>
                )}
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a className="underline underline-offset-4" href="/login">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupFeature;
