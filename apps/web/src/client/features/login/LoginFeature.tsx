"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "@/client/features/common/components/atoms/FormInput";
import { Button } from "@/client/features/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/features/common/components/ui/card";
import { Form } from "@/client/features/common/components/ui/form";
import { cn } from "@/client/lib/utils";
import { login } from "@/common/actions/supabase/actions";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFeature = () => {
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setIsLoading(true);
    setServerError("");

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login({}, formData);

      if (result?.error) {
        setServerError(result.error);
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex w-1/3 flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormInput
                form={form}
                name="email"
                label="Email"
                placeholder="m@example.com"
                type="email"
              />

              <div className="space-y-2">
                <FormInput
                  form={form}
                  name="password"
                  label="Password"
                  placeholder=""
                  type="password"
                  labelSuffix={
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  }
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                  className="w-full"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
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
