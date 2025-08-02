import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ForgotPasswordPage from './page';

vi.mock('@/client/features/forgot-password/forgot-password-feature', () => ({
  default: vi.fn(() => (
    <div data-testid="forgot-password-feature">Forgot Password Feature</div>
  )),
}));

describe('ForgotPasswordPage', () => {
  it('should render the ForgotPasswordFeature component', () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByTestId('forgot-password-feature')).toBeInTheDocument();
  });

  it('should display the forgot password feature content', () => {
    render(<ForgotPasswordPage />);

    const elements = screen.getAllByTestId('forgot-password-feature');
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent('Forgot Password Feature');
  });

  it('should render without crashing', () => {
    expect(() => render(<ForgotPasswordPage />)).not.toThrow();
  });
});
