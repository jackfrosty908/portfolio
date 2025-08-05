export const supabaseStrategy = async ({ 
  payload, 
  headers 
}: {
  payload: any;
  headers: Headers;
}) => {
  try {
    // Extract cookies from headers
    const cookieHeader = headers.get('cookie');
    if (!cookieHeader) {
      return {
        user: null,
      };
    }

    // Parse cookies
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [name, value] = c.split('=');
        return [name, decodeURIComponent(value)];
      })
    );

    // Get Supabase cookies
    const supabaseCookies = Object.entries(cookies)
      .filter(([name]) => name.startsWith('sb-'))
      .map(([name, value]) => ({ name, value }));

    if (supabaseCookies.length === 0) {
      return {
        user: null,
      };
    }

    // Create Supabase client
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
            // Can't set cookies in this context
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        user: null,
      };
    }

    // Find existing admin user
    const adminUsers = await payload.find({
      collection: 'admins',
      where: {
        supabaseId: {
          equals: user.id,
        },
      },
    });

    if (adminUsers.docs.length > 0) {
      return {
        user: {
          ...adminUsers.docs[0],
          collection: 'admins',
        },
      };
    }

    // Create new admin user
    const newUser = await payload.create({
      collection: 'admins',
      data: {
        email: user.email,
        supabaseId: user.id,
      },
    });

    return {
      user: {
        ...newUser,
        collection: 'admins',
      },
    };
  } catch (error) {
    console.error('Supabase strategy error:', error);
    return {
      user: null,
    };
  }
}; 