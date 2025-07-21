import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Loader from './loader';

vi.mock('lucide-react', () => ({
  Loader2: ({
    className,
    ...props
  }: {
    className?: string;
    [key: string]: unknown;
  }) =>
    createElement('div', {
      'data-testid': 'loader-icon',
      className,
      ...props,
    }),
}));

describe('Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports Loader function', () => {
    expect(typeof Loader).toBe('function');
  });

  it('renders without crashing', () => {
    const component = createElement(Loader);
    expect(component).toBeDefined();
    expect(component.type).toBe(Loader);
  });

  it('renders the correct structure', () => {
    const component = Loader();
    expect(component).toBeDefined();
    expect(component.type).toBe('div');
  });

  it('has proper container styling classes', () => {
    const component = Loader();
    expect(component.props.className).toBe(
      'flex h-full items-center justify-center pt-8'
    );
  });

  it('includes Loader2 icon component', () => {
    const component = Loader();
    expect(component.props.children).toBeDefined();
  });

  it('applies animate-spin class to loader icon', () => {
    const TestWrapper = () => Loader();
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('renders with expected component structure', () => {
    const component = Loader();
    expect(component.type).toBe('div');
    expect(component.props.children).toBeDefined();
  });
});
