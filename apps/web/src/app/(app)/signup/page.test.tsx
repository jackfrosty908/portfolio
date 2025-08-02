import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SignupPage from './page';

// Mock the SignupFeature component
vi.mock('@/client/features/signup/signup-feature', () => ({
  default: vi.fn(() => <div data-testid="signup-feature">Signup Feature</div>),
}));

describe('SignupPage', () => {
  it('should render the SignupFeature component', () => {
    render(<SignupPage />);

    expect(screen.getByTestId('signup-feature')).toBeInTheDocument();
  });

  it('should display the signup feature content', () => {
    render(<SignupPage />);

    // Use getAllByTestId to handle multiple instances and check that at least one exists
    const elements = screen.getAllByTestId('signup-feature');
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toHaveTextContent('Signup Feature');
  });

  it('should render without crashing', () => {
    expect(() => render(<SignupPage />)).not.toThrow();
  });
});
