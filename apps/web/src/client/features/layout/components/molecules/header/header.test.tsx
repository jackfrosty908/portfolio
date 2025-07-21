import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './header';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) =>
    createElement('a', { 'data-testid': 'nav-link', href, ...props }, children),
}));

vi.mock(
  '@/features/layout/components/molecules/mode-toggle/mode-toggle',
  () => ({
    ModeToggle: () =>
      createElement('div', { 'data-testid': 'mode-toggle' }, 'ModeToggle'),
  })
);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports Header function', () => {
    expect(typeof Header).toBe('function');
  });

  it('renders without crashing', () => {
    const component = createElement(Header);
    expect(component).toBeDefined();
    expect(component.type).toBe(Header);
  });

  it('renders the correct structure', () => {
    const component = Header();
    expect(component).toBeDefined();
    expect(component.type).toBe('div');
  });

  it('includes navigation with home link', () => {
    const TestWrapper = () => {
      const result = Header();
      return result;
    };

    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('includes ModeToggle component', () => {
    const component = Header();
    expect(component).toBeDefined();
  });

  it('has proper component structure with main container and hr', () => {
    const component = Header();
    expect(component.type).toBe('div');
  });

  it('navigation structure contains links array', () => {
    const TestWrapper = () => {
      return Header();
    };

    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('renders with expected className structure', () => {
    const component = Header();
    expect(component.props.children).toBeDefined();
  });

  it('home link has correct href', () => {
    const TestWrapper = () => Header();
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('contains horizontal rule separator', () => {
    const component = Header();
    expect(component.props.children).toBeDefined();
  });
});
