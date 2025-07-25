import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import ForgotPasswordFeature from './ForgotPassword';

// Mock the forgotPassword action
vi.mock('@/common/actions/supabase/actions', () => ({
  forgotPassword: vi.fn(),
}));

// Mock the FormInput component to be simpler and focus on the test
vi.mock('@/client/features/common/components/atoms/FormInput', () => ({
  default: vi.fn(({ name, label, placeholder, type, form, state }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        data-testid={`input-${name}`}
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
      />
      {/* Mock FormMessage for validation errors */}
      {form?.formState?.errors?.[name] && (
        <p className="text-red-500 text-sm" data-testid={`error-${name}`}>
          {form.formState.errors[name]?.message}
        </p>
      )}
      {state?.errors?.[name] && (
        <p
          className="text-red-500 text-sm"
          data-testid={`server-error-${name}`}
        >
          {state.errors[name]?.[0]}
        </p>
      )}
    </div>
  )),
}));

describe('ForgotPasswordFeature', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the form with all fields', () => {
    render(<ForgotPasswordFeature />);

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email address and we'll send you a link to reset your password."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send reset link' })
    ).toBeInTheDocument();
  });

  it('should show success state when password reset is successful', async () => {
    const { forgotPassword } = await import(
      '@/common/actions/supabase/actions'
    );
    (forgotPassword as Mock).mockResolvedValue({
      success: 'Password reset link sent to your email',
    });

    render(<ForgotPasswordFeature />);

    const emailInput = screen.getByTestId('input-email');
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Check your email')).toBeInTheDocument();
      expect(
        screen.getByText('Password reset link sent to your email')
      ).toBeInTheDocument();
    });
  });

  it('should show an error if the server returns an error', async () => {
    const { forgotPassword } = await import(
      '@/common/actions/supabase/actions'
    );
    (forgotPassword as Mock).mockResolvedValue({
      serverError: 'Email not found',
    });

    render(<ForgotPasswordFeature />);

    const emailInput = screen.getByTestId('input-email');
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

  it('should show pending state while submitting', async () => {
    const { forgotPassword } = await import(
      '@/common/actions/supabase/actions'
    );
    (forgotPassword as Mock).mockImplementation(() => new Promise(() => {}));

    render(<ForgotPasswordFeature />);

    const emailInput = screen.getByTestId('input-email');
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });
  });

  it('should have a link back to login', () => {
    render(<ForgotPasswordFeature />);

    const loginLink = screen.getByRole('link', { name: 'Back to login' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should render without crashing', () => {
    expect(() => render(<ForgotPasswordFeature />)).not.toThrow();
  });

  it('should disable submit button when pending', async () => {
    const { forgotPassword } = await import(
      '@/common/actions/supabase/actions'
    );
    (forgotPassword as Mock).mockImplementation(() => new Promise(() => {}));

    render(<ForgotPasswordFeature />);

    const emailInput = screen.getByTestId('input-email');
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
    });
  });

  it('should enable submit button when not pending', () => {
    render(<ForgotPasswordFeature />);

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    expect(submitButton).not.toBeDisabled();
  });

  it('should handle form submission', async () => {
    const { forgotPassword } = await import(
      '@/common/actions/supabase/actions'
    );
    (forgotPassword as Mock).mockResolvedValue({});

    render(<ForgotPasswordFeature />);

    const emailInput = screen.getByTestId('input-email');
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', {
      name: 'Send reset link',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalled();
    });
  });
});
