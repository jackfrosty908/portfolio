/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: test mocks */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import ResetPasswordFeature from './reset-password-feature';

vi.mock('@/common/actions/supabase/actions', () => ({
  resetPassword: vi.fn(),
}));

describe('ResetPasswordFeature', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the form with all fields', () => {
    render(<ResetPasswordFeature />);

    expect(screen.getByText('Set new password')).toBeDefined();
    expect(screen.getByLabelText('New Password')).toBeDefined();
    expect(screen.getByLabelText('Confirm Password')).toBeDefined();
    expect(
      screen.getByRole('button', { name: 'Update password' })
    ).toBeDefined();
  });

  it('should show an error if passwords do not match', async () => {
    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password456'
    );

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeDefined();
    });
  });

  it('should show an error if password is too short', async () => {
    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'pass');

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters.')
      ).toBeDefined();
    });
  });

  it('should show an error if the server returns an error', async () => {
    const { resetPassword } = await import('@/common/actions/supabase/actions');
    (resetPassword as Mock).mockResolvedValue({
      serverError: 'Something went wrong',
    });

    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password123'
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Update password' })
    );

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeDefined();
    });
  });

  it('should show pending state while submitting', async () => {
    const { resetPassword } = await import('@/common/actions/supabase/actions');
    (resetPassword as Mock).mockImplementation(() => new Promise(() => {}));

    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password123'
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Update password' })
    );

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeDefined();
    });
  });
});
