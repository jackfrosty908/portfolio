import { createServerClient } from '@supabase/ssr';
import { decodeJwt } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';
import logger from '@/common/utils/logger/logger';

/*
 * Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
 * Always use supabase.auth.getUser() to protect pages and user data.
 * Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.
 * It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
 * */

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    //TODO @JF add variable manager
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({
            request,
          });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is trying to access admin without being authenticated
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', '/admin'); // Optional: redirect back to admin after login
    return NextResponse.redirect(url);
  }

  // require admin role for /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // already have `user` from getUser() above
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', '/admin');
      return NextResponse.redirect(url);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const claims = decodeJwt(token) as Record<string, unknown>;
    const permissions = Array.isArray(
      (claims as Record<string, unknown>).permissions
    )
      ? ((claims as Record<string, unknown>).permissions as string[])
      : [];
    if (!permissions.includes('user.manage')) {
      logger.info('User is trying to access admin without admin role', {
        path: request.nextUrl.pathname,
        userId: user?.id,
      });
      const url = request.nextUrl.clone();
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }
  }

  if (
    !(
      user ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname.startsWith('/signup') ||
      request.nextUrl.pathname.startsWith('/forgot-password') ||
      request.nextUrl.pathname.startsWith('/error') ||
      request.nextUrl.pathname.startsWith('/')
    )
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
