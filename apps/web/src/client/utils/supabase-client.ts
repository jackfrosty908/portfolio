import { createBrowserClient } from '@supabase/ssr';
//access Supabase from Client Components, which run in the browser.
export function createClient() {
  return createBrowserClient(
    //TODO: JF variable manager
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
