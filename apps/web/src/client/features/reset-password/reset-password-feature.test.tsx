/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: test mocks */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Supabase client mocks (must be defined before component import)
const updateUserMock = vi.fn();
const getSessionMock = vi.fn();
const setSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();

vi.mock('@/client/utils/supabase-client', () => {
  return {
    createClient: () => ({
      auth: {
        updateUser: updateUserMock,
        getSession: getSessionMock,
        setSession: setSessionMock,
        onAuthStateChange: onAuthStateChangeMock,
      },
    }),
  };
});

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

import ResetPasswordFeature from './reset-password-feature';

describe('ResetPasswordFeature (client flow)', () => {
  beforeEach(() => {
    // Default: session is available and subscription object exists
    getSessionMock.mockResolvedValue({ data: { session: {} } });
    setSessionMock.mockResolvedValue({ error: null });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    updateUserMock.mockResolvedValue({ error: null });

    // Ensure no hash tokens by default
    Object.defineProperty(window, 'location', {
      value: { ...window.location, hash: '', pathname: '/', search: '' },
      writable: true,
    });

    // Spy on replaceState for hash-cleanup assertions
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    pushMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the form with all fields', async () => {
    render(<ResetPasswordFeature />);

    expect(screen.getByText('Set new password')).toBeDefined();
    expect(screen.getByLabelText('New Password')).toBeDefined();
    expect(screen.getByLabelText('Confirm Password')).toBeDefined();

    const btn = screen.getByRole('button', { name: 'Update password' });
    await waitFor(() => expect(btn).not.toBeDisabled());
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

  it('should show an error if the update fails', async () => {
    updateUserMock.mockResolvedValueOnce({
      error: { message: 'Something went wrong' },
    });

    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password123'
    );

    const btn = screen.getByRole('button', { name: 'Update password' });
    await waitFor(() => expect(btn).not.toBeDisabled());
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeDefined();
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should show pending state while submitting', async () => {
    updateUserMock.mockImplementationOnce(
      () => new Promise(() => {}) // never resolves
    );

    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password123'
    );

    const btn = screen.getByRole('button', { name: 'Update password' });
    await waitFor(() => expect(btn).not.toBeDisabled());
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeDefined();
    });
  });

  it('disables submit and shows preparing message when no session yet', () => {
    getSessionMock.mockResolvedValueOnce({ data: { session: null } });

    render(<ResetPasswordFeature />);

    const btn = screen.getByRole('button', { name: 'Update password' });
    expect(btn).toBeDisabled();
    expect(screen.getByText('Preparing your reset session…')).toBeDefined();
  });

  it('handles hash tokens, sets session, and clears hash', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hash: '#access_token=a&refresh_token=b',
        pathname: '/',
        search: '',
      },
      writable: true,
    });

    render(<ResetPasswordFeature />);

    await waitFor(() => {
      expect(setSessionMock).toHaveBeenCalledWith({
        access_token: 'a',
        refresh_token: 'b',
      });
    });

    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  it('redirects to login after successful update', async () => {
    render(<ResetPasswordFeature />);

    await userEvent.type(screen.getByLabelText('New Password'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Confirm Password'),
      'password123'
    );

    const btn = screen.getByRole('button', { name: 'Update password' });
    await waitFor(() => expect(btn).not.toBeDisabled());
    await userEvent.click(btn);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('unsubscribes auth listener on unmount', () => {
    const unsubscribe = vi.fn();
    onAuthStateChangeMock.mockReturnValueOnce({
      data: { subscription: { unsubscribe } },
    });

    const { unmount } = render(<ResetPasswordFeature />);
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
