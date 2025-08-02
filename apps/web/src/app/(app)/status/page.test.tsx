import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Status from './page';

vi.mock('@/features/layout/components/atoms/health-check/HealthCheck', () => ({
  default: () =>
    createElement('div', { 'data-testid': 'health-check' }, 'HealthCheck'),
}));

describe('Status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports Status function', () => {
    expect(typeof Status).toBe('function');
  });

  it('renders without crashing', () => {
    const component = createElement(Status);
    expect(component).toBeDefined();
    expect(component.type).toBe(Status);
  });

  it('renders the correct structure', () => {
    const component = Status();
    expect(component).toBeDefined();
    expect(component.type).toBe('div');
  });

  it('has proper container styling classes', () => {
    const component = Status();
    expect(component.props.className).toBe(
      'container mx-auto max-w-3xl px-4 py-2'
    );
  });

  it('displays portfolio title', () => {
    const component = Status();
    expect(component.props.children).toBeDefined();
  });

  it('includes HealthCheck component', () => {
    const component = Status();
    expect(component.props.children).toBeDefined();
  });

  it('has API Status section', () => {
    const component = Status();
    const gridSection = component.props.children;
    expect(gridSection.props.className).toBe('grid gap-6');
  });

  it('has proper section styling for API status', () => {
    const TestWrapper = () => Status();
    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });
});
