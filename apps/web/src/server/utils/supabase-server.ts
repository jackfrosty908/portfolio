import 'server-only';

import type { IncomingHttpHeaders } from 'node:http';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// access Supabase from Server Components, Server Actions, and Route Handlers, which run only on the server.
export async function createClient(headers?: IncomingHttpHeaders) {
  const cookieStore = await cookies();

  return createServerClient(
    //TODO @JF add variable manager
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          if (headers) {
            return Object.entries(headers)
              .map(([name, value]) => ({ name, value: value as string }))
              .filter(({ name }) => name.startsWith('sb-'));
          }
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
