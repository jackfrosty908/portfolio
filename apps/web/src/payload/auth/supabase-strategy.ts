import type { UserMetadata } from '@supabase/supabase-js';
import { decodeJwt } from 'jose';
import type { AuthStrategyFunctionArgs } from 'payload';
import logger from '@/logger';

type JwtClaims = {
  user_role?: 'admin' | 'writer' | 'user' | 'public';
  user_roles?: Array<'admin' | 'writer' | 'user' | 'public'>;
  permissions?: string[];
};

/**
 * Supabase auth strategy for Payload.
 *
 * What it does:
 * - Reads Supabase cookies from request headers and creates an SSR client.
 * - Fetches the Supabase user; if none, returns { user: null } (not authenticated).
 * - Uses the Supabase user UUID as the Payload users.id (single source of truth).
 * - First login: provisions a Payload user (mirrors basic identity fields).
 * - Subsequent logins: returns the existing Payload user document.
 *
 * Important:
 * - Do NOT call payload.db here; it's not available in this strategy context.
 * - Admin access is enforced via:
 *   - JWT custom claim user_role (middleware), and/or
 *   - a single EXISTS query in Users.access.admin (memoized per request).
 */
export const supabaseStrategy = async ({
  payload,
  headers,
  strategyName,
}: AuthStrategyFunctionArgs) => {
  try {
    // Extract Supabase cookies from the incoming request
    const cookieHeader = headers.get('cookie');
    if (!cookieHeader) {
      return { user: null };
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [name, value] = c.split('=');
        return [name, decodeURIComponent(value)];
      })
    );

    // Only forward Supabase cookies (sb-*)
    const supabaseCookies = Object.entries(cookies)
      .filter(([name]) => name.startsWith('sb-'))
      .map(([name, value]) => ({ name, value }));

    if (supabaseCookies.length === 0) {
      return { user: null };
    }

    // Create SSR Supabase client using only the request cookies
    const { createServerClient } = await import('@supabase/ssr');
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        cookies: {
          getAll() {
            return supabaseCookies;
          },
          setAll() {
            // no-op in this context
          },
        },
      }
    );

    // Read the currently authenticated Supabase user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    const claims = (
      token ? (decodeJwt(token) as unknown as JwtClaims) : {}
    ) as JwtClaims;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { user: null };
    }

    // Look up the Payload user (Payload users.id == Supabase UUID)
    const found = await payload.find({
      collection: 'users',
      where: { id: { equals: user.id } },
      limit: 1,
    });

    // First login: provision the Payload user using the Supabase UUID as id
    if (found.docs.length === 0) {
      const created = await payload.create({
        collection: 'users',
        data: {
          id: user.id,
          email: user.email ?? '',
          first_name: (user.user_metadata as UserMetadata)?.first_name ?? null,
          last_name: (user.user_metadata as UserMetadata)?.last_name ?? null,
        },
      });

      return {
        user: {
          ...created,
          claims,
          collection: 'users' as const,
          _strategy: strategyName,
        },
      };
    }

    // Return existing document; permissions are enforced elsewhere
    return {
      user: {
        ...found.docs[0],
        claims,
        collection: 'users' as const,
        _strategy: strategyName,
      },
    };
  } catch (error) {
    logger.error('Supabase strategy error:', error);
    return { user: null };
  }
};
