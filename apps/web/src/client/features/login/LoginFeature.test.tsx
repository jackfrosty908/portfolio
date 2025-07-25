import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import LoginFeature from "./LoginFeature";

vi.mock("@/common/actions/supabase/actions", () => ({
  login: vi.fn(),
  // This has to be done here otherwise there are issues importing from a server action file
  loginSchema: z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
  }),
}));

vi.mock("@/client/features/common/components/atoms/FormInput", () => ({
  default: vi.fn(({ name, label, placeholder, type, form, labelSuffix }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        data-testid={`input-${name}`}
        defaultValue=""
      />
      {labelSuffix && <span data-testid={`suffix-${name}`}>{labelSuffix}</span>}
    </div>
  )),
}));

describe("LoginFeature", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render the form with all fields", () => {
    render(<LoginFeature />);

    expect(screen.getByText("Login to your account")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email below to login to your account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should show forgot password link", () => {
    render(<LoginFeature />);

    const forgotPasswordLink = screen.getByText("Forgot your password?");
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
  });

  it("should show sign up link", () => {
    render(<LoginFeature />);

    const signUpLink = screen.getByText("Sign up");
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });

  it("should disable submit button initially", () => {
    render(<LoginFeature />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    expect(submitButton).toBeDisabled();
  });

  it("should render without crashing", () => {
    expect(() => render(<LoginFeature />)).not.toThrow();
  });

  it("should have correct form structure", () => {
    render(<LoginFeature />);

    const form = screen.getByTestId("input-email").closest("form");
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByTestId("input-email");
    const passwordInput = screen.getByTestId("input-password");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "m@example.com");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should have proper accessibility attributes", () => {
    render(<LoginFeature />);

    const emailLabel = screen.getByText("Email");
    const passwordLabel = screen.getByText("Password");
    const emailInput = screen.getByTestId("input-email");
    const passwordInput = screen.getByTestId("input-password");

    expect(emailInput).toHaveAttribute("id", "email");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(emailLabel).toHaveAttribute("for", "email");
    expect(passwordLabel).toHaveAttribute("for", "password");
  });

  it("should have proper card structure", () => {
    render(<LoginFeature />);

    const card = screen
      .getByTestId("input-email")
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();

    const cardTitle = screen.getByText("Login to your account");
    const cardDescription = screen.getByText(
      "Enter your email below to login to your account",
    );

    expect(cardTitle).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("should have proper button attributes", () => {
    render(<LoginFeature />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toBeDisabled();
  });
});
