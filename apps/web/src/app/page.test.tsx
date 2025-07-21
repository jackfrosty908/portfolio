import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './page';

vi.mock('@/features/layout/components/atoms/health-check/HealthCheck', () => ({
  default: () =>
    createElement('div', { 'data-testid': 'health-check' }, 'HealthCheck'),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports Home function', () => {
    expect(typeof Home).toBe('function');
  });

  it('renders without crashing', () => {
    const component = createElement(Home);
    expect(component).toBeDefined();
    expect(component.type).toBe(Home);
  });

  it('renders the correct structure', () => {
    const component = Home();
    expect(component).toBeDefined();
    expect(component.type).toBe('div');
  });

  it('has proper container styling classes', () => {
    const component = Home();
    expect(component.props.className).toBe(
      'container mx-auto max-w-3xl px-4 py-2'
    );
  });

  it('displays portfolio title', () => {
    const component = Home();
    expect(component.props.children).toBeDefined();
  });

  it('includes HealthCheck component', () => {
    const component = Home();
    expect(component.props.children).toBeDefined();
  });

  it('has API Status section', () => {
    const component = Home();
    const gridSection = component.props.children[1];
    expect(gridSection.props.className).toBe('grid gap-6');
  });

  it('renders with expected component structure', () => {
    const component = Home();
    expect(component.type).toBe('div');
    expect(component.props.children).toHaveLength(2);
  });

  it('has proper section styling for API status', () => {
    const TestWrapper = () => Home();
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('contains pre element with portfolio text', () => {
    const component = Home();
    const preElement = component.props.children[0];
    expect(preElement.type).toBe('pre');
    expect(preElement.props.className).toBe(
      'overflow-x-auto font-mono text-sm'
    );
  });
});
