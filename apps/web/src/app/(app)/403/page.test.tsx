import { cleanup, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
// biome-ignore lint/performance/noNamespaceImport: importing for mocking
import * as serverUtils from '@/server/utils/supabase-server';
import '@testing-library/jest-dom/vitest';

const RE_BACK_TO_HOME = /Back to Home/i;
const RE_SIGN_IN = /Sign in/i;

vi.mock('@/server/utils/supabase-server', () => ({
  createClient: vi.fn(),
}));

vi.mock(
  '@/client/features/layout/components/atoms/logout-button/logout-button',
  () => ({
    default: () => (
      <button data-testid="logout-button" type="button">
        Logout
      </button>
    ),
  })
);

type ServerClient = Awaited<ReturnType<typeof serverUtils.createClient>>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('403 Forbidden page', () => {
  it('renders the heading and base layout', async () => {
    const fakeClient = {
      auth: { getUser: async () => ({ data: { user: null } }) },
    } as unknown as ServerClient;

    (serverUtils.createClient as unknown as Mock).mockResolvedValue(fakeClient);

    const Page = (await import('./page')).default;
    const { container } = render(await Page());

    expect(within(container).getByText('403 — Forbidden')).toBeInTheDocument();
    expect(within(container).getByText('Access denied')).toBeInTheDocument();
    expect(
      within(container).getByRole('link', { name: RE_BACK_TO_HOME })
    ).toBeInTheDocument();
  });

  it('shows Sign in when unauthenticated', async () => {
    const fakeClient = {
      auth: { getUser: async () => ({ data: { user: null } }) },
    } as unknown as ServerClient;

    (serverUtils.createClient as unknown as Mock).mockResolvedValue(fakeClient);

    const Page = (await import('./page')).default;
    const { container } = render(await Page());

    expect(
      within(container).getByText('You are not authorized to access this page.')
    ).toBeInTheDocument();

    const signInLink = within(container).getByRole('link', {
      name: RE_SIGN_IN,
    });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');

    expect(
      within(container).queryByTestId('logout-button')
    ).not.toBeInTheDocument();
  });

  it('shows Logout when authenticated', async () => {
    const fakeClient = {
      auth: { getUser: async () => ({ data: { user: { id: 'user_123' } } }) },
    } as unknown as ServerClient;

    (serverUtils.createClient as unknown as Mock).mockResolvedValue(fakeClient);

    const Page = (await import('./page')).default;
    const { container } = render(await Page());

    expect(
      within(container).getByText(
        "You're signed in but don't have permission to access this page."
      )
    ).toBeInTheDocument();

    expect(within(container).getByTestId('logout-button')).toBeInTheDocument();
    expect(
      within(container).queryByRole('link', { name: RE_SIGN_IN })
    ).not.toBeInTheDocument();
  });
});
