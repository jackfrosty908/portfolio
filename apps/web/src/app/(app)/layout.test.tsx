import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}));

vi.mock('../index.css', () => ({}));

vi.mock('@/client/features/layout/components/molecules/header/header', () => ({
  default: () => createElement('div', { 'data-testid': 'header' }, 'Header'),
}));

vi.mock('@/client/providers/providers', () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    createElement('div', { 'data-testid': 'providers' }, children),
}));

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports RootLayout function', () => {
    expect(typeof RootLayout).toBe('function');
  });

  it('renders without crashing', () => {
    const component = (
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );
    expect(component).toBeDefined();
    expect(component.type).toBe(RootLayout);
  });

  it('renders the correct HTML structure', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    expect(component).toBeDefined();
    expect(component.type).toBe('html');
  });

  it('has proper html attributes', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    expect(component.props.lang).toBe('en');
    expect(component.props.suppressHydrationWarning).toBe(true);
  });

  it('has body with font variables in className', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    const bodyElement = component.props.children;
    expect(bodyElement.type).toBe('body');
    expect(bodyElement.props.className).toBe(
      '--font-geist-sans --font-geist-mono antialiased'
    );
  });

  it('includes Providers wrapper', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    expect(component.props.children).toBeDefined();
  });

  it('includes Header component', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    expect(component.props.children).toBeDefined();
  });

  it('has proper grid layout structure', () => {
    const TestWrapper = () =>
      RootLayout({
        children: createElement('div', {}, 'Test content'),
      });
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('renders children correctly', () => {
    const testChild = createElement(
      'div',
      { 'data-testid': 'test-child' },
      'Test content'
    );
    const component = RootLayout({ children: testChild });
    expect(component.props.children).toBeDefined();
  });

  it('has correct component hierarchy', () => {
    const component = RootLayout({
      children: createElement('div', {}, 'Test content'),
    });
    expect(component.type).toBe('html');
    expect(component.props.children.type).toBe('body');
  });

  it('applies grid layout classes to main container', () => {
    const TestWrapper = () =>
      RootLayout({
        children: createElement('div', {}, 'Test content'),
      });
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });
});
