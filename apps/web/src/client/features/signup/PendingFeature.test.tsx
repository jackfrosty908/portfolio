import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PendingFeature from "./PendingFeature";

// Mock the lucide-react icons
vi.mock("lucide-react", () => ({
  MailIcon: vi.fn(({ className }) => (
    <svg className={className} data-testid="mail-icon">
      <title>Mail Icon</title>
      <path d="M0 0h24v24H0z" />
    </svg>
  )),
}));

describe("PendingFeature", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render the pending confirmation screen", () => {
    render(<PendingFeature />);

    expect(screen.getByText("Thank you for signing up!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We've sent a verification link to your email. Please check your inbox to complete your registration.",
      ),
    ).toBeInTheDocument();
  });

  it("should display the mail icon", () => {
    render(<PendingFeature />);

    const mailIcon = screen.getByTestId("mail-icon");
    expect(mailIcon).toBeInTheDocument();
    expect(mailIcon).toHaveClass(
      "mx-auto",
      "mb-4",
      "h-16",
      "w-16",
      "text-muted-foreground",
    );
  });

  it("should have proper card structure", () => {
    render(<PendingFeature />);

    const card = screen.getByTestId("mail-icon").closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();

    const cardTitle = screen.getByText("Thank you for signing up!");
    const cardDescription = screen.getByText(
      "We've sent a verification link to your email. Please check your inbox to complete your registration.",
    );

    expect(cardTitle).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it("should have proper layout classes", () => {
    render(<PendingFeature />);

    // Find the outermost container div that has the layout classes
    const container = screen.getByTestId("mail-icon").closest("div");
    const outerContainer = container?.parentElement?.parentElement;

    expect(outerContainer).toHaveClass(
      "flex",
      "h-screen",
      "w-full",
      "items-center",
      "justify-center",
      "p-4",
    );
  });

  it("should have proper card styling", () => {
    render(<PendingFeature />);

    const card = screen.getByTestId("mail-icon").closest('[data-slot="card"]');
    expect(card).toHaveClass("w-full", "max-w-md");
  });

  it("should have centered card header", () => {
    render(<PendingFeature />);

    const cardHeader = screen
      .getByTestId("mail-icon")
      .closest('[data-slot="card-header"]');
    expect(cardHeader).toHaveClass("text-center");
  });

  it("should render without crashing", () => {
    expect(() => render(<PendingFeature />)).not.toThrow();
  });

  it("should have proper icon styling", () => {
    render(<PendingFeature />);

    const mailIcon = screen.getByTestId("mail-icon");
    expect(mailIcon).toHaveClass(
      "mx-auto",
      "mb-4",
      "h-16",
      "w-16",
      "text-muted-foreground",
    );
  });

  it("should have proper text content", () => {
    render(<PendingFeature />);

    const title = screen.getByText("Thank you for signing up!");
    const description = screen.getByText(
      "We've sent a verification link to your email. Please check your inbox to complete your registration.",
    );

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();

    // Check that the title has the correct data-slot attribute instead of tag name
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  it("should have proper accessibility structure", () => {
    render(<PendingFeature />);

    const title = screen.getByText("Thank you for signing up!");
    const description = screen.getByText(
      "We've sent a verification link to your email. Please check your inbox to complete your registration.",
    );

    // Check that the title has proper heading semantics
    expect(title).toHaveAttribute("data-slot", "card-title");
    expect(description).toHaveAttribute("data-slot", "card-description");
  });
});
