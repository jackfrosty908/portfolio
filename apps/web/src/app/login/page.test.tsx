import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

vi.mock("@/client/features/login/LoginFeature", () => ({
  default: vi.fn(() => <div data-testid="login-feature">Login Feature</div>),
}));

describe("LoginPage", () => {
  it("should render the LoginFeature component", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-feature")).toBeInTheDocument();
  });

  it("should display the login feature content", () => {
    render(<LoginPage />);

    const elements = screen.getAllByTestId("login-feature");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent("Login Feature");
  });

  it("should render without crashing", () => {
    expect(() => render(<LoginPage />)).not.toThrow();
  });
});
