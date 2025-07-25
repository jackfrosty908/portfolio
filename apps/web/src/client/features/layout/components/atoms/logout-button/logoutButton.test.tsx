import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LogoutButton from './LogoutButton';

// Hoist mocks
const { mockPush, mockRefresh, mockCreateClient } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockCreateClient: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock Supabase client
vi.mock('@/client/utils/supabase-client', () => ({
  createClient: mockCreateClient,
}));

// Mock UI Button component
vi.mock('@/client/features/common/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    [key: string]: unknown;
  }) => (
    <button
      data-testid="logout-button"
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock console to avoid test output pollution
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('initial render', () => {
    it('renders logout button with correct text', () => {
      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('renders with outline variant', () => {
      render(<LogoutButton />);
      const button = screen.getByTestId('logout-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });
  });

  describe('logout functionality', () => {
    const mockSignOut = vi.fn();

    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          signOut: mockSignOut,
        },
      });
    });

    it('calls logout process when clicked', async () => {
      mockSignOut.mockResolvedValue({ error: null });
      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockCreateClient).toHaveBeenCalledOnce();
        expect(mockSignOut).toHaveBeenCalledOnce();
      });
    });

    it('shows loading state during logout', async () => {
      let resolveSignOut: (value: any) => void;
      const signOutPromise = new Promise((resolve) => {
        resolveSignOut = resolve;
      });
      mockSignOut.mockReturnValue(signOutPromise);

      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });

      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Logging out...' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
      });

      resolveSignOut!({ error: null });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Logout' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });

    it('navigates to home page after successful logout', async () => {
      mockSignOut.mockResolvedValue({ error: null });
      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
        expect(mockRefresh).toHaveBeenCalledOnce();
      });
    });
  });

  describe('error handling', () => {
    it('handles Supabase client creation failure and resets state', async () => {
      mockCreateClient.mockRejectedValue(new Error('Client creation failed'));
      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });
      fireEvent.click(button);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Logout' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });

    it('handles signOut failure and resets state', async () => {
      const mockSignOut = vi
        .fn()
        .mockRejectedValue(new Error('Sign out failed'));
      mockCreateClient.mockResolvedValue({
        auth: {
          signOut: mockSignOut,
        },
      });
      render(<LogoutButton />);
      const button = screen.getByRole('button', { name: 'Logout' });
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledOnce();
        expect(
          screen.getByRole('button', { name: 'Logout' })
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });
  });

  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<LogoutButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
