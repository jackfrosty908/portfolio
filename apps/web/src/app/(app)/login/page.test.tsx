import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './page';

vi.mock('@/client/features/login/login-feature', () => ({
  default: vi.fn(() => <div data-testid="login-feature">Login Feature</div>),
}));

const renderLoginPage = async (
  params: Record<string, string | string[] | undefined> = {}
) => {
  const ui = await LoginPage({ searchParams: Promise.resolve(params) });
  return render(ui as unknown as React.ReactElement);
};

describe('LoginPage', () => {
  it('should render the LoginFeature component', async () => {
    await renderLoginPage({ redirectTo: '/admin' });
    expect(screen.getByTestId('login-feature')).toBeInTheDocument();
  });

  it('should display the login feature content', async () => {
    await renderLoginPage();
    const elements = screen.getAllByTestId('login-feature');
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent('Login Feature');
  });

  it('should render without crashing', async () => {
    await expect(renderLoginPage()).resolves.not.toThrow();
  });
});
