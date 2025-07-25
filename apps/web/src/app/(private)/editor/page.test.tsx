/** biome-ignore-all lint/performance/useTopLevelRegex: test mocks */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EditorPage from './page';

// Hoist mocks
const { mockCreateClient, mockRedirect } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockRedirect: vi.fn(),
}));

// Mock Supabase server client
vi.mock('@/server/utils/supabase-server', () => ({
  createClient: mockCreateClient,
}));

// Mock Next.js redirect
vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

describe('EditorPage', () => {
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: mockGetUser,
      },
    });
    // Reset redirect mock to throw so we can catch it in tests
    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`Redirect to: ${url}`);
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('when user is authenticated', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    };

    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('renders user email when authenticated', async () => {
      render(await EditorPage());
      await waitFor(() => {
        expect(screen.getByText(`Hello ${mockUser.email}`)).toBeInTheDocument();
      });
    });

    it('calls Supabase client to get user', async () => {
      await EditorPage();
      expect(mockCreateClient).toHaveBeenCalledOnce();
      expect(mockGetUser).toHaveBeenCalledOnce();
    });

    it('does not redirect when authenticated', async () => {
      await EditorPage();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });
    });

    it('redirects to login page', async () => {
      await expect(EditorPage()).rejects.toThrow('Redirect to: /login');
      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('does not render the page content', async () => {
      try {
        await EditorPage();
      } catch (_) {
        // Expected redirect error
      }
      expect(screen.queryByText(/Hello/)).not.toBeInTheDocument();
    });
  });

  describe('when there is an authentication error', () => {
    const mockError = new Error('Authentication failed');

    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });
    });

    it('redirects to login page on error', async () => {
      await expect(EditorPage()).rejects.toThrow('Redirect to: /login');
      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('when Supabase client fails', () => {
    it('throws the underlying error when createClient fails', async () => {
      const clientError = new Error('Failed to create Supabase client');
      mockCreateClient.mockRejectedValue(clientError);
      await expect(EditorPage()).rejects.toThrow(
        'Failed to create Supabase client'
      );
    });

    it('throws the underlying error when getUser fails', async () => {
      const getUserError = new Error('Failed to get user');
      mockGetUser.mockRejectedValue(getUserError);
      await expect(EditorPage()).rejects.toThrow('Failed to get user');
    });
  });
});
