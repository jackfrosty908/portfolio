"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/server/utils/supabase-server";

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

export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  //TODO: @JF Validate inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    switch (error.code) {
      case "weak_password":
        return { error: "Password is too weak" };
      case "email_exists":
        return { error: "Email already exists" };
      default:
        return { error: "Something went wrong" };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
