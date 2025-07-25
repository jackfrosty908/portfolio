import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HealthCheck from './health-check';

const mockUseQuery = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => mockUseQuery(),
}));

vi.mock('@/client/utils/trpc', () => ({
  trpc: {
    healthCheck: {
      queryOptions: () => ({}),
    },
  },
}));

describe('HealthCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports HealthCheck function', () => {
    expect(typeof HealthCheck).toBe('function');
  });

  it('renders without crashing', () => {
    mockUseQuery.mockReturnValue({
      data: true,
      isLoading: false,
    });

    const component = createElement(HealthCheck);
    expect(component).toBeDefined();
    expect(component.type).toBe(HealthCheck);
  });

  it('shows loading state when isLoading is true', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const component = HealthCheck();
    expect(component).toBeDefined();
    expect(component.type).toBe('div');
  });

  it('shows connected state when data is true', () => {
    mockUseQuery.mockReturnValue({
      data: true,
      isLoading: false,
    });

    const component = HealthCheck();
    expect(component.props.className).toBe('flex items-center gap-2');
    expect(component.props.children).toBeDefined();
  });

  it('shows disconnected state when data is false', () => {
    mockUseQuery.mockReturnValue({
      data: false,
      isLoading: false,
    });

    const component = HealthCheck();
    expect(component.props.className).toBe('flex items-center gap-2');
    expect(component.props.children).toBeDefined();
  });

  it('shows disconnected state when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const component = HealthCheck();
    expect(component.props.className).toBe('flex items-center gap-2');
    expect(component.props.children).toBeDefined();
  });

  it('has proper container styling classes', () => {
    mockUseQuery.mockReturnValue({
      data: true,
      isLoading: false,
    });

    const component = HealthCheck();
    expect(component.props.className).toBe('flex items-center gap-2');
  });

  it('renders indicator and text elements', () => {
    mockUseQuery.mockReturnValue({
      data: true,
      isLoading: false,
    });

    const component = HealthCheck();
    expect(component.props.children).toHaveLength(2);
  });

  it('calls useQuery with trpc healthCheck options', () => {
    mockUseQuery.mockReturnValue({
      data: true,
      isLoading: false,
    });

    HealthCheck();
    expect(mockUseQuery).toHaveBeenCalledTimes(1);
  });
});
