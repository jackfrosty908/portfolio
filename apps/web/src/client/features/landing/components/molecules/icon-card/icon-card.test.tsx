import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const MockIcon: LucideIcon = vi.fn(() =>
  createElement("svg", { "data-testid": "mock-icon" }),
) as unknown as LucideIcon;

vi.mock("@/client/components/ui/card", () => ({
  Card: vi.fn(({ children, className }) =>
    createElement("div", { "data-testid": "card", className }, children),
  ),
  CardContent: vi.fn(({ children }) =>
    createElement("div", { "data-testid": "card-content" }, children),
  ),
  CardDescription: vi.fn(({ children }) =>
    createElement("p", { "data-testid": "card-description" }, children),
  ),
  CardHeader: vi.fn(({ children }) =>
    createElement("div", { "data-testid": "card-header" }, children),
  ),
  CardTitle: vi.fn(({ children }) =>
    createElement("h3", { "data-testid": "card-title" }, children),
  ),
}));

import {
  Card as MockCard,
  CardContent as MockCardContent,
  CardDescription as MockCardDescription,
  CardHeader as MockCardHeader,
  CardTitle as MockCardTitle,
} from "@/client/components/ui/card";
import IconCard from "./icon-card";

describe("IconCard", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    icon: MockIcon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const component = createElement(IconCard, defaultProps);
    expect(component).toBeDefined();
    expect(component.type).toBe(IconCard);
  });

  it("renders the correct component structure", () => {
    const component = IconCard(defaultProps);
    expect(component.type).toBe(MockCard);
  });

  it("applies correct CSS classes to the card", () => {
    const component = IconCard(defaultProps);
    expect(component.props.className).toBe(
      "text-center transition-shadow hover:shadow-lg",
    );
  });

  it("renders card header and content", () => {
    const component = IconCard(defaultProps);
    const [header, content] = component.props.children;

    expect(header.type).toBe(MockCardHeader);
    expect(content.type).toBe(MockCardContent);
  });

  it("renders icon with correct styling", () => {
    const component = IconCard(defaultProps);
    const header = component.props.children[0];
    const iconContainer = header.props.children[0];
    const iconElement = iconContainer.props.children;

    expect(iconElement.type).toBe(MockIcon);
    expect(iconElement.props.className).toBe("h-6 w-6 rounded-sm text-primary");
  });

  it("displays the title correctly", () => {
    const component = IconCard(defaultProps);
    const header = component.props.children[0];
    const titleElement = header.props.children[1];

    expect(titleElement.type).toBe(MockCardTitle);
    expect(titleElement.props.children).toBe("Test Title");
  });

  it("displays the description correctly", () => {
    const component = IconCard(defaultProps);
    const content = component.props.children[1];
    const descriptionElement = content.props.children;

    expect(descriptionElement.type).toBe(MockCardDescription);
    expect(descriptionElement.props.children).toBe("Test Description");
  });

  it("handles different title and description values", () => {
    const customProps = {
      title: "Custom Title",
      description: "Custom Description",
      icon: MockIcon,
    };

    const component = IconCard(customProps);
    const header = component.props.children[0];
    const content = component.props.children[1];
    const titleElement = header.props.children[1];
    const descriptionElement = content.props.children;

    expect(titleElement.props.children).toBe("Custom Title");
    expect(descriptionElement.props.children).toBe("Custom Description");
  });

  it("renders with different icon components", () => {
    const AnotherMockIcon: LucideIcon = vi.fn(() =>
      createElement("svg", { "data-testid": "another-mock-icon" }),
    ) as unknown as LucideIcon;

    const propsWithDifferentIcon = {
      ...defaultProps,
      icon: AnotherMockIcon,
    };

    const component = IconCard(propsWithDifferentIcon);
    const header = component.props.children[0];
    const iconContainer = header.props.children[0];
    const iconElement = iconContainer.props.children;

    expect(iconElement.type).toBe(AnotherMockIcon);
    expect(iconElement.props.className).toBe("h-6 w-6 rounded-sm text-primary");
  });

  it("creates proper icon container with styling", () => {
    const component = IconCard(defaultProps);
    const cardChildren = component.props.children;
    const headerElement = cardChildren[0];
    const headerChildren = headerElement.props.children;
    const iconContainer = headerChildren[0];

    expect(iconContainer.props.className).toBe(
      "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10",
    );
  });

  it("maintains correct component hierarchy", () => {
    const component = IconCard(defaultProps);
    expect(component.type).toBe(MockCard);

    const [header, content] = component.props.children;
    expect(header.type).toBe(MockCardHeader);
    expect(content.type).toBe(MockCardContent);
  });
});
