import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";
import {
  forgotPassword,
  login,
  loginSchema,
  resetPassword,
  signup,
} from "./actions";

// Mock Next.js functions
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
};

vi.mock("@/server/utils/supabase-server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}));

const mockedRevalidatePath = revalidatePath as MockedFunction<
  typeof revalidatePath
>;
const mockedRedirect = redirect as MockedFunction<typeof redirect>;

describe("Supabase Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  });

  describe("loginSchema", () => {
    it("should validate valid login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain(
          "Invalid email address.",
        );
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Password is required.",
        );
      }
    });
  });

  describe("login", () => {
    it("should return validation errors for invalid data", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "");

      const result = await login(null, formData);

      expect(result).toEqual({
        errors: {
          email: ["Invalid email address."],
          password: ["Password is required."],
        },
      });
      expect(mockSupabaseClient.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it("should return error for invalid credentials", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        error: { message: "Invalid login credentials" },
      });

      const result = await login(null, formData);

      expect(result).toEqual({
        error: "Invalid credentials",
      });
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrongpassword",
      });
    });

    it("should redirect on successful login", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "correctpassword");

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        error: null,
      });
      mockedRedirect.mockImplementation(() => {
        throw new Error("REDIRECT"); // Simulate redirect
      });

      await expect(login(null, formData)).rejects.toThrow("REDIRECT");

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "correctpassword",
      });
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(mockedRedirect).toHaveBeenCalledWith("/");
    });
  });

  describe("signup", () => {
    it("should return validation errors for invalid data", async () => {
      const formData = new FormData();
      formData.append("firstName", "A"); // Too short
      formData.append("lastName", "B"); // Too short
      formData.append("email", "invalid-email");
      formData.append("password", "short"); // Too short

      const result = await signup({}, formData);

      expect(result).toEqual({
        errors: {
          firstName: ["First name must be at least 2 characters."],
          lastName: ["Last name must be at least 2 characters."],
          email: ["Invalid email address."],
          password: ["Password must be at least 8 characters."],
        },
      });
      expect(mockSupabaseClient.auth.signUp).not.toHaveBeenCalled();
    });

    it("should return server error on signup failure", async () => {
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        error: { message: "User already registered" },
      });

      const result = await signup({}, formData);

      expect(result).toEqual({
        serverError: "Whoops, something went wrong. Please try again.",
      });
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        options: {
          data: {
            first_name: "John",
            last_name: "Doe",
          },
        },
      });
    });

    it("should redirect on successful signup", async () => {
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        error: null,
      });
      mockedRedirect.mockImplementation(() => {
        throw new Error("REDIRECT"); // Simulate redirect
      });

      await expect(signup({}, formData)).rejects.toThrow("REDIRECT");

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        options: {
          data: {
            first_name: "John",
            last_name: "Doe",
          },
        },
      });
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(mockedRedirect).toHaveBeenCalledWith("/signup/pending");
    });
  });

  describe("forgotPassword", () => {
    it("should return validation errors for invalid email", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");

      const result = await forgotPassword({}, formData);

      expect(result).toEqual({
        errors: {
          email: ["Invalid email address."],
        },
      });
      expect(
        mockSupabaseClient.auth.resetPasswordForEmail,
      ).not.toHaveBeenCalled();
    });

    it("should return server error on reset failure", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");

      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: "Failed to send email" },
      });

      const result = await forgotPassword({}, formData);

      expect(result).toEqual({
        serverError: "Failed to send reset email. Please try again.",
      });
      expect(
        mockSupabaseClient.auth.resetPasswordForEmail,
      ).toHaveBeenCalledWith("test@example.com", {
        redirectTo: "http://localhost:3000/auth/reset-password",
      });
    });

    it("should return success message on successful reset email", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");

      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: null,
      });

      const result = await forgotPassword({}, formData);

      expect(result).toEqual({
        success: "Check your email for a password reset link.",
      });
      expect(
        mockSupabaseClient.auth.resetPasswordForEmail,
      ).toHaveBeenCalledWith("test@example.com", {
        redirectTo: "http://localhost:3000/auth/reset-password",
      });
    });
  });

  describe("resetPassword", () => {
    it("should return validation errors for invalid passwords", async () => {
      const formData = new FormData();
      formData.append("password", "short"); // Too short
      formData.append("confirmPassword", "different");

      const result = await resetPassword({}, formData);

      expect(result).toEqual({
        errors: {
          password: ["Password must be at least 8 characters."],
          confirmPassword: ["Passwords don't match"],
        },
      });
      expect(mockSupabaseClient.auth.updateUser).not.toHaveBeenCalled();
    });

    it("should return validation error for mismatched passwords", async () => {
      const formData = new FormData();
      formData.append("password", "password123");
      formData.append("confirmPassword", "differentpassword");

      const result = await resetPassword({}, formData);

      expect(result).toEqual({
        errors: {
          confirmPassword: ["Passwords don't match"],
        },
      });
      expect(mockSupabaseClient.auth.updateUser).not.toHaveBeenCalled();
    });

    it("should return server error on update failure", async () => {
      const formData = new FormData();
      formData.append("password", "newpassword123");
      formData.append("confirmPassword", "newpassword123");

      mockSupabaseClient.auth.updateUser.mockResolvedValue({
        error: { message: "Failed to update password" },
      });

      const result = await resetPassword({}, formData);

      expect(result).toEqual({
        serverError: "Failed to update password. Please try again.",
      });
      expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({
        password: "newpassword123",
      });
    });

    it("should redirect on successful password reset", async () => {
      const formData = new FormData();
      formData.append("password", "newpassword123");
      formData.append("confirmPassword", "newpassword123");

      mockSupabaseClient.auth.updateUser.mockResolvedValue({
        error: null,
      });
      mockedRedirect.mockImplementation(() => {
        throw new Error("REDIRECT"); // Simulate redirect
      });

      await expect(resetPassword({}, formData)).rejects.toThrow("REDIRECT");

      expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({
        password: "newpassword123",
      });
      expect(mockedRevalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(mockedRedirect).toHaveBeenCalledWith("/login");
    });
  });
});
