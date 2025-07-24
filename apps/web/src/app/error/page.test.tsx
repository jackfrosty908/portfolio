import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorPage from "./page";

describe("ErrorPage", () => {
  it("should render the error message", () => {
    render(<ErrorPage />);

    expect(screen.getByText("Sorry, something went wrong")).toBeInTheDocument();
  });

  it("should display the error message in a paragraph element", () => {
    render(<ErrorPage />);

    // Use getAllByText to handle multiple instances and check the first one
    const errorMessages = screen.getAllByText("Sorry, something went wrong");
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages[0].tagName).toBe("P");
  });

  it("should render without crashing", () => {
    expect(() => render(<ErrorPage />)).not.toThrow();
  });
});
