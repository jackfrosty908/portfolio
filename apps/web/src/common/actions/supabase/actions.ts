"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/common/actions/supabase/schema";

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

export type ForgotPasswordState = {
	errors?: {
		email?: string[];
	};
	serverError?: string;
	success?: string;
};

export type ResetPasswordState = {
	errors?: {
		password?: string[];
		confirmPassword?: string[];
	};
	serverError?: string;
};

export async function login(prevState: unknown, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = loginSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data } = validatedFields;

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
			serverError: "Whoops, something went wrong. Please try again.",
		};
	}

	revalidatePath("/", "layout");
	redirect("/signup/pending");
}

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
});

export async function forgotPassword(
	prevState: ForgotPasswordState,
	formData: FormData,
) {
	const supabase = await createClient();

	const validatedFields = forgotPasswordSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data: validatedData } = validatedFields;

	const { error } = await supabase.auth.resetPasswordForEmail(
		validatedData.email,
		{
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
		},
	);

	if (error) {
		return {
			serverError: "Failed to send reset email. Please try again.",
		};
	}

	return {
		success: "Check your email for a password reset link.",
	};
}

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export async function resetPassword(
	prevState: ResetPasswordState,
	formData: FormData,
) {
	const supabase = await createClient();

	const validatedFields = resetPasswordSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { data: validatedData } = validatedFields;

	const { error } = await supabase.auth.updateUser({
		password: validatedData.password,
	});

	if (error) {
		return {
			serverError: "Failed to update password. Please try again.",
		};
	}

	revalidatePath("/", "layout");
	redirect("/login");
}
