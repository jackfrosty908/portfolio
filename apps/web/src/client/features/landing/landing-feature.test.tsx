import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock all dependencies
vi.mock('lucide-react', () => ({
  BookOpen: () => <div />,
  BriefcaseBusiness: () => <div />,
  CheckCircle: () => <div />,
  Code: () => <div />,
  Database: () => <div />,
  Palette: () => <div />,
}));

vi.mock('@/client/features/landing/components/molecules/hero/hero', () => ({
  default: () => <div data-testid="hero" />,
}));

vi.mock(
  '@/client/features/landing/components/molecules/icon-card/icon-card',
  () => ({
    default: () => <div data-testid="icon-card" />,
  })
);

vi.mock('@/client/features/common/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import LandingFeature from './landing-feature';

describe('LandingFeature', () => {
  it('renders without crashing', () => {
    const { container } = render(<LandingFeature />);
    expect(container).toBeInTheDocument();
  });

  it('renders the hero component', () => {
    const { getAllByTestId } = render(<LandingFeature />);
    const heroes = getAllByTestId('hero');
    expect(heroes.length).toBeGreaterThan(0);
  });

  it('renders icon cards', () => {
    const { getAllByTestId } = render(<LandingFeature />);
    const iconCards = getAllByTestId('icon-card');
    expect(iconCards.length).toBeGreaterThan(0);
  });

  it('renders main content sections', () => {
    const { container } = render(<LandingFeature />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('has proper component structure', () => {
    const { container } = render(<LandingFeature />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-h-screen');
  });
});
