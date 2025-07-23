"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/server/utils/supabase-server";

export type SignupState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
  serverError?: string;
};

export async function login(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  //TODO: @JF Validate inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Invalid credentials" };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export async function signup(prevState: SignupState, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: validatedData } = validatedFields;

  const { error } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
      },
    },
  });

  if (error) {
    return {
      serverError: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
