import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './header';

// Hoist the mock function creation before imports
const { mockCreateClient } = vi.hoisted(() => {
  return {
    mockCreateClient: vi.fn(),
  };
});

// Mock server-side Supabase client
vi.mock('@/server/utils/supabase-server', () => ({
  createClient: mockCreateClient,
}));

// Mock LogoutButton component
vi.mock(
  '@/client/features/layout/components/atoms/logout-button/LogoutButton',
  () => ({
    default: () => (
      <button data-testid="logout-button" type="button">
        Logout
      </button>
    ),
  })
);

// Mock ModeToggle component
vi.mock(
  '@/features/layout/components/molecules/mode-toggle/mode-toggle',
  () => ({
    ModeToggle: () => <div data-testid="mode-toggle">ModeToggle</div>,
  })
);

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a data-testid="nav-link" href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      } as any);
    });

    it('renders navigation links', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Signup' })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Forgot Password' })
      ).toBeInTheDocument();
    });

    it('renders correct href attributes for navigation links', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'href',
        '/'
      );
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
        'href',
        '/login'
      );
      expect(screen.getByRole('link', { name: 'Signup' })).toHaveAttribute(
        'href',
        '/signup'
      );
      expect(
        screen.getByRole('link', { name: 'Forgot Password' })
      ).toHaveAttribute('href', '/forgot-password');
    });

    it('renders ModeToggle component', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByTestId('mode-toggle')).toBeInTheDocument();
    });

    it('does not render user greeting or logout button', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.queryByText(/Hello,/)).not.toBeInTheDocument();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('renders horizontal rule separator', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    const mockUser = {
      user_metadata: {
        first_name: 'John',
      },
    };

    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
      } as any);
    });

    it('renders user greeting with first name', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByText('Hello, John')).toBeInTheDocument();
    });

    it('renders logout button', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('renders all navigation links', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Signup' })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Forgot Password' })
      ).toBeInTheDocument();
    });

    it('renders ModeToggle component', async () => {
      const HeaderComponent = await Header();
      render(HeaderComponent);

      expect(screen.getByTestId('mode-toggle')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      } as any);
    });

    it('has correct container structure', async () => {
      const HeaderComponent = await Header();
      const { container } = render(HeaderComponent);

      const flexContainer = container.querySelector(
        '.flex.flex-row.items-center.justify-between.px-2.py-1'
      );
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass(
        'flex',
        'flex-row',
        'items-center',
        'justify-between',
        'px-2',
        'py-1'
      );
    });

    it('calls Supabase auth.getUser', async () => {
      const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: null },
      });

      mockCreateClient.mockResolvedValue({
        auth: {
          getUser: mockGetUser,
        },
      } as any);

      await Header();

      expect(mockCreateClient).toHaveBeenCalledOnce();
      expect(mockGetUser).toHaveBeenCalledOnce();
    });
  });
});
