import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Ensure table exists (in case generation misses it)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS public.user_roles (
      user_id uuid PRIMARY KEY,
      role public.app_role NOT NULL DEFAULT 'user'
    );
  `);

  // Hook function that injects user_role into JWT
  // enable the hook in Supabase
  // (Authentication > Hooks > Custom access token → set to pg-functions://postgres/public/custom_access_token_hook)
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
    RETURNS jsonb
    LANGUAGE plpgsql
    STABLE
    AS $$
    DECLARE
      claims jsonb;
      user_role public.app_role;
    BEGIN
      SELECT role INTO user_role
      FROM public.user_roles
      WHERE user_id = (event->>'user_id')::uuid;

      claims := event->'claims';
      IF user_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
      ELSE
        claims := jsonb_set(claims, '{user_role}', 'null');
      END IF;

      event := jsonb_set(event, '{claims}', claims);
      RETURN event;
    END;
    $$;
  `);

  // Security: let Supabase Auth call it; nobody else
  await db.execute(sql`GRANT USAGE ON SCHEMA public TO supabase_auth_admin;`);
  await db.execute(
    sql`GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;`
  );
  await db.execute(
    sql`REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;`
  );
  await db.execute(
    sql`GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;`
  );

  //Revoke permissions from other roles (e.g. anon, authenticated, public) to ensure the function is not accessible by Supabase Data APIs.
  await db.execute(
    sql`REVOKE ALL ON TABLE public.user_roles FROM authenticated, anon, public;`
  );

  // Let Supabase Auth read user_roles for role lookup
  await db.execute(
    sql`ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`
  );
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Allow auth admin to read user roles'
      ) THEN
        CREATE POLICY "Allow auth admin to read user roles" ON public.user_roles
        AS PERMISSIVE FOR SELECT
        TO supabase_auth_admin
        USING (true);
      END IF;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop policy if present
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Allow auth admin to read user roles'
      ) THEN
        DROP POLICY "Allow auth admin to read user roles" ON public.user_roles;
      END IF;
    END $$;
  `);

  // Revoke only if the function exists
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE p.proname = 'custom_access_token_hook'
          AND n.nspname = 'public'
          AND pg_get_function_identity_arguments(p.oid) = 'jsonb'
      ) THEN
        REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM supabase_auth_admin;
        REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;
      END IF;
    END $$;
  `);

  // Drop function and table if present
  await db.execute(
    sql`DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);`
  );
  await db.execute(sql`DROP TABLE IF EXISTS public.user_roles;`);
}
