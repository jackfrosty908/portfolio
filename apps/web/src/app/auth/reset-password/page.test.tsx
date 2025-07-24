import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResetPasswordPage from "./page";

vi.mock("@/client/features/reset-password/ResetPasswordFeature", () => ({
  default: vi.fn(() => (
    <div data-testid="reset-password-feature">Reset Password Feature</div>
  )),
}));

describe("ResetPasswordPage", () => {
  it("should render the ResetPasswordFeature component", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByTestId("reset-password-feature")).toBeInTheDocument();
  });

  it("should display the reset password feature content", () => {
    render(<ResetPasswordPage />);

    const elements = screen.getAllByTestId("reset-password-feature");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent("Reset Password Feature");
  });

  it("should render without crashing", () => {
    expect(() => render(<ResetPasswordPage />)).not.toThrow();
  });
});
