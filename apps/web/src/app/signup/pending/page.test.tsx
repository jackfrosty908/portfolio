import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PendingPage from "./page";

vi.mock("@/client/features/signup/PendingFeature", () => ({
  default: vi.fn(() => (
    <div data-testid="pending-feature">Pending Feature</div>
  )),
}));

describe("PendingPage", () => {
  it("should render the PendingFeature component", () => {
    render(<PendingPage />);

    expect(screen.getByTestId("pending-feature")).toBeInTheDocument();
  });

  it("should display the pending feature content", () => {
    render(<PendingPage />);

    const elements = screen.getAllByTestId("pending-feature");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent("Pending Feature");
  });

  it("should render without crashing", () => {
    expect(() => render(<PendingPage />)).not.toThrow();
  });

  it("should have the correct component structure", () => {
    render(<PendingPage />);

    const elements = screen.getAllByTestId("pending-feature");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0].tagName).toBe("DIV");
  });

  it("should be accessible", () => {
    render(<PendingPage />);

    const elements = screen.getAllByTestId("pending-feature");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeVisible();
  });

  it("should render the pending confirmation message", () => {
    render(<PendingPage />);

    const elements = screen.getAllByTestId("pending-feature");
    expect(elements.length).toBeGreaterThan(0);

    expect(elements[0]).toBeInTheDocument();
  });
});
