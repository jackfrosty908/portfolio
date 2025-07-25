import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import SignupFeature from './SignupFeature';

// Mock the signup action
vi.mock('@/common/actions/supabase/actions', () => ({
  signup: vi.fn(),
}));

// Mock the FormInput component to be simpler and focus on the test
vi.mock('@/client/features/common/components/atoms/FormInput', () => ({
  default: vi.fn(({ name, label, placeholder, type, form, state }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        data-testid={`input-${name}`}
        defaultValue=""
        id={name}
        name={name}
        placeholder={placeholder}
        type={type || 'text'}
      />
    </div>
  )),
}));

describe('SignupFeature', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the form with all fields', () => {
    render(<SignupFeature />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your information below to create your account')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' })
    ).toBeInTheDocument();
  });

  it('should show login link', () => {
    render(<SignupFeature />);

    const loginLink = screen.getByText('Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should have proper form structure', () => {
    render(<SignupFeature />);

    const form = screen.getByTestId('input-firstName').closest('form');
    expect(form).toBeInTheDocument();

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    expect(firstNameInput).toHaveAttribute('placeholder', 'John');
    expect(lastNameInput).toHaveAttribute('placeholder', 'Doe');
    expect(emailInput).toHaveAttribute('placeholder', 'm@example.com');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should have proper accessibility attributes', () => {
    render(<SignupFeature />);

    const firstNameLabel = screen.getByText('First Name');
    const lastNameLabel = screen.getByText('Last Name');
    const emailLabel = screen.getByText('Email');
    const passwordLabel = screen.getByText('Password');
    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    expect(firstNameInput).toHaveAttribute('id', 'firstName');
    expect(lastNameInput).toHaveAttribute('id', 'lastName');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(firstNameLabel).toHaveAttribute('for', 'firstName');
    expect(lastNameLabel).toHaveAttribute('for', 'lastName');
    expect(emailLabel).toHaveAttribute('for', 'email');
    expect(passwordLabel).toHaveAttribute('for', 'password');
  });

  it('should have proper card structure', () => {
    render(<SignupFeature />);

    const card = screen
      .getByTestId('input-firstName')
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();

    const cardTitle = screen.getByText('Create an account');
    const cardDescription = screen.getByText(
      'Enter your information below to create your account'
    );

    expect(cardTitle).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  it('should have proper button attributes', () => {
    render(<SignupFeature />);

    const submitButton = screen.getByRole('button', { name: 'Create account' });
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('should show loading state while submitting', async () => {
    const { signup } = await import('@/common/actions/supabase/actions');
    (signup as Mock).mockImplementation(() => new Promise(() => {}));

    render(<SignupFeature />);

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create account' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Creating account...' })
      ).toBeDisabled();
    });
  });

  it('should handle successful signup', async () => {
    const { signup } = await import('@/common/actions/supabase/actions');
    (signup as Mock).mockResolvedValue({});

    render(<SignupFeature />);

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create account' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
    });
  });

  it('should call signup action with correct form data', async () => {
    const { signup } = await import('@/common/actions/supabase/actions');
    (signup as Mock).mockResolvedValue({});

    render(<SignupFeature />);

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create account' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({}, expect.any(FormData));
      const formData = (signup as Mock).mock.calls[0][1];
      expect(formData.get('firstName')).toBe('John');
      expect(formData.get('lastName')).toBe('Doe');
      expect(formData.get('email')).toBe('john@example.com');
      expect(formData.get('password')).toBe('password123');
    });
  });

  it('should render without crashing', () => {
    expect(() => render(<SignupFeature />)).not.toThrow();
  });

  it('should have proper layout classes', () => {
    render(<SignupFeature />);

    // Find the outermost container div that has the layout classes
    const container = screen.getByTestId('input-firstName').closest('div');
    const outerContainer =
      container?.parentElement?.parentElement?.parentElement?.parentElement;

    expect(outerContainer).toHaveClass('flex', 'w-1/3', 'flex-col', 'gap-6');
  });

  it('should have proper card styling', () => {
    render(<SignupFeature />);

    const card = screen
      .getByTestId('input-firstName')
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should have proper form action', () => {
    render(<SignupFeature />);

    const form = screen.getByTestId('input-firstName').closest('form');
    expect(form).toHaveAttribute('action');
  });
});
