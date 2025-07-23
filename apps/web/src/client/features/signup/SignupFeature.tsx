"use client";

import { useActionState } from "react";
import { Button } from "@/client/features/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/features/common/components/ui/card";
import { Input } from "@/client/features/common/components/ui/input";
import { Label } from "@/client/features/common/components/ui/label";

import { signup } from "@/common/actions/supabase/actions";

const initialState = {
  error: "",
};

const SignupFeature = () => {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className={"flex w-1/3 flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={pending} type="submit" className="w-full">
                  Create account
                </Button>
                {state?.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupFeature;
