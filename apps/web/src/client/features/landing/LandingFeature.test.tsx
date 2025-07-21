import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  BookOpen: vi.fn(() =>
    createElement("svg", { "data-testid": "book-open-icon" }),
  ),
  BriefcaseBusiness: vi.fn(() =>
    createElement("svg", { "data-testid": "briefcase-business-icon" }),
  ),
  Calendar: vi.fn(() =>
    createElement("svg", { "data-testid": "calendar-icon" }),
  ),
  Code: vi.fn(() => createElement("svg", { "data-testid": "code-icon" })),
}));

// Mock Hero component
vi.mock("@/client/features/landing/components/molecules/hero/hero", () => ({
  default: vi.fn(({ title, description }) =>
    createElement("div", { "data-testid": "hero", title, description }),
  ),
}));

// Mock IconCard component
vi.mock(
  "@/client/features/landing/components/molecules/icon-card/icon-card",
  () => ({
    default: vi.fn(({ title, description, icon }) =>
      createElement("div", {
        "data-testid": "icon-card",
        title,
        description,
        icon,
      }),
    ),
  }),
);

import { BookOpen, BriefcaseBusiness, Calendar, Code } from "lucide-react";
import Hero from "@/client/features/landing/components/molecules/hero/hero";
import IconCard from "@/client/features/landing/components/molecules/icon-card/icon-card";
import LandingFeature from "./LandingFeature";

const MockBookOpen = BookOpen;
const MockBriefcaseBusiness = BriefcaseBusiness;
const MockCalendar = Calendar;
const MockCode = Code;
const MockHero = Hero;
const MockIconCard = IconCard;

describe("LandingFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const component = createElement(LandingFeature);
    expect(component).toBeDefined();
    expect(component.type).toBe(LandingFeature);
  });

  it("renders the correct root structure", () => {
    const component = LandingFeature();
    expect(component.type).toBe("div");
    expect(component.props.className).toBe(
      "min-h-screen bg-gradient-to-b from-background to-muted/20",
    );
  });

  it("applies correct container classes", () => {
    const component = LandingFeature();
    const container = component.props.children;
    expect(container.props.className).toBe(
      "container mx-auto max-w-4xl px-4 py-8",
    );
  });

  it("renders Hero component with correct props", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const flexContainer = container.props.children;
    const sections = flexContainer.props.children;
    const heroElement = sections[0];

    expect(heroElement.type).toBe(MockHero);
    expect(heroElement.props.title).toBe("Jack's Portfolio");
  });

  it("renders Hero with complex description content", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const flexContainer = container.props.children;
    const sections = flexContainer.props.children;
    const heroElement = sections[0];

    expect(heroElement.props.description).toBeDefined();
    expect(typeof heroElement.props.description).toBe("object");
  });

  it("renders the What This Site Is For section", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];

    expect(whatSection.type).toBe("section");
    expect(whatSection.props.className).toBe("space-y-8");
  });

  it("displays correct heading in What This Site Is For section", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const headerDiv = whatSection.props.children[0];
    const heading = headerDiv.props.children[0];

    expect(heading.type).toBe("h2");
    expect(heading.props.children).toBe("What This Site Is For");
    expect(heading.props.className).toBe("font-bold text-3xl md:text-4xl");
  });

  it("displays correct description in What This Site Is For section", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const headerDiv = whatSection.props.children[0];
    const description = headerDiv.props.children[1];

    expect(description.type).toBe("p");
    expect(description.props.children).toBe(
      "More than just a portfolio - it's a living showcase of development and learning",
    );
  });

  it("renders grid with correct styling for icon cards", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];

    expect(grid.type).toBe("div");
    expect(grid.props.className).toBe("grid gap-6 md:grid-cols-3");
  });

  it("renders four IconCards total", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;

    // 3 IconCards in the main section
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];
    const mainIconCards = grid.props.children;

    // 1 IconCard in the coming soon section
    const comingSoonSection = sections[2];
    const comingSoonIconCard = comingSoonSection.props.children[1];

    expect(mainIconCards).toHaveLength(3);
    expect(comingSoonIconCard.type).toBe(MockIconCard);
  });

  it("renders Portfolio IconCard with correct props", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];
    const portfolioCard = grid.props.children[0];

    expect(portfolioCard.type).toBe(MockIconCard);
    expect(portfolioCard.props.title).toBe("Portfolio");
    expect(portfolioCard.props.description).toBe(
      "Showcasing my projects, skills, and professional journey as a full stack developer.",
    );
    expect(portfolioCard.props.icon).toBe(MockBriefcaseBusiness);
  });

  it("renders Playground IconCard with correct props", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];
    const playgroundCard = grid.props.children[1];

    expect(playgroundCard.type).toBe(MockIconCard);
    expect(playgroundCard.props.title).toBe("Playground");
    expect(playgroundCard.props.description).toBe(
      "A testing ground for new frameworks, patterns, and experimental features.",
    );
    expect(playgroundCard.props.icon).toBe(MockCode);
  });

  it("renders Knowledge Base IconCard with correct props", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];
    const knowledgeCard = grid.props.children[2];

    expect(knowledgeCard.type).toBe(MockIconCard);
    expect(knowledgeCard.props.title).toBe("Knowledge Base");
    expect(knowledgeCard.props.description).toBe(
      "Eventually, a collection of insights, tutorials, and learnings from my development journey.",
    );
    expect(knowledgeCard.props.icon).toBe(MockBookOpen);
  });

  it("renders the Coming Soon section", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const comingSoonSection = sections[2];

    expect(comingSoonSection.type).toBe("section");
    expect(comingSoonSection.props.className).toBe("space-y-8 pb-16");
  });

  it("displays correct heading in Coming Soon section", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const comingSoonSection = sections[2];
    const headerDiv = comingSoonSection.props.children[0];
    const heading = headerDiv.props.children[0];

    expect(heading.type).toBe("h2");
    expect(heading.props.children).toBe("Coming Soon");
    expect(heading.props.className).toBe("font-bold text-3xl md:text-4xl");
  });

  it("renders Feature Timeline IconCard with correct props", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const comingSoonSection = sections[2];
    const timelineCard = comingSoonSection.props.children[1];

    expect(timelineCard.type).toBe(MockIconCard);
    expect(timelineCard.props.title).toBe("Feature Timeline");
    expect(timelineCard.props.description).toBe(
      "A detailed roadmap of upcoming features and improvements will be displayed here.",
    );
    expect(timelineCard.props.icon).toBe(MockCalendar);
  });

  it("maintains correct overall component hierarchy", () => {
    const component = LandingFeature();
    expect(component.type).toBe("div");

    const container = component.props.children;
    expect(container.type).toBe("div");

    const flexContainer = container.props.children;
    expect(flexContainer.type).toBe("div");
    expect(flexContainer.props.className).toBe("flex flex-col gap-16");

    const sections = flexContainer.props.children;
    expect(Array.isArray(sections)).toBe(true);
    expect(sections).toHaveLength(3);
  });

  it("applies correct spacing classes", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const flexContainer = container.props.children;

    expect(flexContainer.props.className).toBe("flex flex-col gap-16");
  });

  it("uses all imported Lucide icons", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;

    // Get icons from main section
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];
    const mainIcons = grid.props.children.map((card: any) => card.props.icon);

    // Get icon from coming soon section
    const comingSoonSection = sections[2];
    const timelineCard = comingSoonSection.props.children[1];
    const timelineIcon = timelineCard.props.icon;

    const allIcons = [...mainIcons, timelineIcon];

    expect(allIcons).toContain(MockBriefcaseBusiness);
    expect(allIcons).toContain(MockCode);
    expect(allIcons).toContain(MockBookOpen);
    expect(allIcons).toContain(MockCalendar);
  });

  it("renders with responsive design classes", () => {
    const component = LandingFeature();
    const container = component.props.children;
    const sections = container.props.children.props.children;
    const whatSection = sections[1];
    const grid = whatSection.props.children[1];

    expect(grid.props.className).toContain("md:grid-cols-3");

    const headerDiv = whatSection.props.children[0];
    const heading = headerDiv.props.children[0];
    expect(heading.props.className).toContain("md:text-4xl");
  });
});
