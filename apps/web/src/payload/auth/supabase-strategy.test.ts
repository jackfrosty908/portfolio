/** biome-ignore-all lint/performance/useTopLevelRegex: test mocks */

import type { AuthStrategyFunctionArgs } from 'payload';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supabaseStrategy } from './supabase-strategy';

// Hoist mock factories so module mocks can reference them
const { mockCreateServerClient, supabaseAuthMocks, mockDecodeJwt, mockLogger } =
  vi.hoisted(() => {
    const getSession = vi.fn();
    const getUser = vi.fn();
    const createServerClient = vi.fn(() => ({
      auth: {
        getSession,
        getUser,
      },
    }));

    const decodeJwt = vi.fn();
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    return {
      mockCreateServerClient: createServerClient,
      supabaseAuthMocks: { getSession, getUser },
      mockDecodeJwt: decodeJwt,
      mockLogger: logger,
    };
  });

// Mock dynamic import of @supabase/ssr used in the strategy
vi.mock('@supabase/ssr', () => ({
  createServerClient: mockCreateServerClient,
}));

// Mock jose.decodeJwt
vi.mock('jose', () => ({
  decodeJwt: mockDecodeJwt,
}));

// Mock logger used by the strategy
vi.mock('@/logger', () => ({
  default: mockLogger,
}));

const headersFromCookie = (cookie: string | null): Headers => {
  const h = new Headers();
  if (cookie) {
    h.set('cookie', cookie);
  }
  return h;
};

describe('supabaseStrategy', () => {
  const strategyName = 'test-strategy';

  const makeArgs = (
    headers: Headers,
    overrides?: Partial<AuthStrategyFunctionArgs>
  ): AuthStrategyFunctionArgs => {
    const payloadMock = {
      find: vi.fn(),
      create: vi.fn(),
    };

    return {
      payload: payloadMock as unknown as AuthStrategyFunctionArgs['payload'],
      headers,
      strategyName,
      ...overrides,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon_key';

    // Default session and user mocks (can be overridden per test)
    supabaseAuthMocks.getSession.mockResolvedValue({
      data: { session: { access_token: 'token-abc' } },
    });

    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    mockDecodeJwt.mockReturnValue({
      user_role: 'user',
      user_roles: ['user'],
      permissions: ['read'],
    });
  });

  it('returns { user: null } when there is no cookie header', async () => {
    const args = makeArgs(headersFromCookie(null));
    const result = await supabaseStrategy(args);
    expect(result).toEqual({ user: null });
    expect(mockCreateServerClient).not.toHaveBeenCalled();
  });

  it('returns { user: null } when there are cookies but none are sb-*', async () => {
    const args = makeArgs(headersFromCookie('foo=bar; hello=world'));
    const result = await supabaseStrategy(args);
    expect(result).toEqual({ user: null });
    expect(mockCreateServerClient).not.toHaveBeenCalled();
  });

  it('returns { user: null } when Supabase user is not authenticated', async () => {
    const args = makeArgs(headersFromCookie('sb-access-token=abc; other=1'));
    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await supabaseStrategy(args);
    expect(mockCreateServerClient).toHaveBeenCalledOnce();
    expect(result).toEqual({ user: null });
  });

  it('provisions a new Payload user on first login and returns it with claims', async () => {
    const headers = headersFromCookie(
      'sb-access-token=abc; sb-refresh-token=xyz; theme=dark'
    );
    const args = makeArgs(headers);

    const mockUser = {
      id: 'user-uuid-1',
      email: 'john@example.com',
      user_metadata: { first_name: 'John', last_name: 'Doe' },
    };

    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const claims = {
      user_role: 'admin' as const,
      user_roles: ['admin', 'writer'] as const,
      permissions: ['manage:all'],
    };
    mockDecodeJwt.mockReturnValue(claims);

    (
      args.payload.find as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      docs: [],
    });

    const createdDoc = {
      id: mockUser.id,
      email: mockUser.email,
      first_name: 'John',
      last_name: 'Doe',
    };

    (
      args.payload.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(createdDoc);

    const result = await supabaseStrategy(args);

    expect(args.payload.find).toHaveBeenCalledWith({
      collection: 'users',
      where: { id: { equals: mockUser.id } },
      limit: 1,
    });

    expect(args.payload.create).toHaveBeenCalledWith({
      collection: 'users',
      data: {
        id: mockUser.id,
        email: mockUser.email,
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    expect(result.user).toBeTruthy();
    expect(result.user?.id).toBe(createdDoc.id);
    expect(result.user?.email).toBe(createdDoc.email);
    expect(result.user?.collection).toBe('users');
    expect(result.user?._strategy).toBe(strategyName);
    expect(result.user?.claims).toEqual(claims);
  });

  it('returns existing Payload user with claims and strategy metadata', async () => {
    const headers = headersFromCookie('sb-ses=abc; sb-anon=xyz');
    const args = makeArgs(headers);

    const mockUser = {
      id: 'user-uuid-2',
      email: 'existing@example.com',
      user_metadata: {},
    };

    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const claims = {
      user_role: 'writer' as const,
      user_roles: ['writer'] as const,
      permissions: ['edit:post'],
    };
    mockDecodeJwt.mockReturnValue(claims);

    const existingDoc = {
      id: mockUser.id,
      email: mockUser.email,
      first_name: 'Existing',
      last_name: 'User',
    };

    (
      args.payload.find as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      docs: [existingDoc],
    });

    const result = await supabaseStrategy(args);

    expect(args.payload.create).not.toHaveBeenCalled();
    expect(result.user).toBeTruthy();
    expect(result.user?.id).toBe(existingDoc.id);
    expect(result.user?.email).toBe(existingDoc.email);
    expect(result.user?.collection).toBe('users');
    expect(result.user?._strategy).toBe(strategyName);
    expect(result.user?.claims).toEqual(claims);
  });

  it('logs and returns { user: null } on unexpected error', async () => {
    const headers = headersFromCookie('sb-ses=abc');
    const args = makeArgs(headers);

    const mockUser = {
      id: 'u-err',
      email: 'err@example.com',
      user_metadata: {},
    };
    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Force an error deeper in the flow

    (
      args.payload.find as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('DB failure'));

    const result = await supabaseStrategy(args);

    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Supabase strategy error:',
      expect.any(Error)
    );
    expect(result).toEqual({ user: null });
  });

  it('invokes cookies.getAll and setAll via createServerClient options', async () => {
    let capturedGetAll: unknown;

    // @ts-expect-error partial type OK in tests
    mockCreateServerClient.mockImplementationOnce((_url, _key, opts) => {
      capturedGetAll = opts.cookies.getAll();
      opts.cookies.setAll();
      return {
        auth: {
          getSession: supabaseAuthMocks.getSession,
          getUser: supabaseAuthMocks.getUser,
        },
      };
    });

    const headers = headersFromCookie(
      'foo=bar; sb-access-token=abc; theme=dark; sb-refresh-token=xyz'
    );
    const args = makeArgs(headers);

    // Valid user so the flow continues
    supabaseAuthMocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'u-opts',
          email: 'opts@example.com',
          user_metadata: {},
        },
      },
      error: null,
    });

    (
      args.payload.find as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      docs: [{ id: 'u-opts', email: 'opts@example.com' }],
    });

    const result = await supabaseStrategy(args);

    expect(result.user?.id).toBe('u-opts');

    // Ensure getAll returned only sb-* cookies
    expect(Array.isArray(capturedGetAll)).toBe(true);
    const names = (
      capturedGetAll as Array<{ name: string; value: string }>
    ).map((c) => c.name);
    expect(names).toEqual(['sb-access-token', 'sb-refresh-token']);
  });

  it('does not decode JWT when session has no access token and returns empty claims', async () => {
    const headers = headersFromCookie('sb-access-token=abc');
    const args = makeArgs(headers);

    // No session token branch
    supabaseAuthMocks.getSession.mockResolvedValue({
      data: { session: null },
    });

    const mockUser = {
      id: 'user-no-token',
      email: 'no-token@example.com',
      user_metadata: {},
    };

    supabaseAuthMocks.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    (
      args.payload.find as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      docs: [{ id: mockUser.id, email: mockUser.email }],
    });

    const result = await supabaseStrategy(args);

    expect(mockDecodeJwt).not.toHaveBeenCalled();
    expect(result.user?.claims).toEqual({});
  });
});
