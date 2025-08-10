import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // authorize() helper
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.authorize(requested_permission public.app_permission)
    RETURNS boolean
    LANGUAGE plpgsql
    STABLE
    SECURITY DEFINER
    SET search_path = ''
    AS $$
    DECLARE
      user_role public.app_role;
      cnt int;
    BEGIN
      SELECT (auth.jwt() ->> 'user_role')::public.app_role INTO user_role;
      SELECT count(*) INTO cnt
      FROM public.role_permissions
      WHERE role_permissions.permission = requested_permission
        AND role_permissions.role = user_role;
      RETURN cnt > 0;
    END;
    $$;
  `);

  // Users RLS + policies
  await db.execute(sql`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select'
      ) THEN
        CREATE POLICY users_select ON public.users
        FOR SELECT TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (id = (SELECT auth.uid()))
        );
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update'
      ) THEN
        CREATE POLICY users_update ON public.users
        FOR UPDATE TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (id = (SELECT auth.uid()))
        )
        WITH CHECK (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (id = (SELECT auth.uid()))
        );
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_delete'
      ) THEN
        CREATE POLICY users_delete ON public.users
        FOR DELETE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // role_permissions RLS + policies (only user.manage)
  await db.execute(sql`ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_select') THEN
        CREATE POLICY role_permissions_select ON public.role_permissions
        FOR SELECT TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_insert') THEN
        CREATE POLICY role_permissions_insert ON public.role_permissions
        FOR INSERT TO authenticated
        WITH CHECK ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_update') THEN
        CREATE POLICY role_permissions_update ON public.role_permissions
        FOR UPDATE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)))
        WITH CHECK ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_delete') THEN
        CREATE POLICY role_permissions_delete ON public.role_permissions
        FOR DELETE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // Optional: lock down Payload internals (block anon/auth entirely)
  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.payload_locked_documents') IS NOT NULL THEN
        ALTER TABLE public.payload_locked_documents ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.payload_locked_documents FROM authenticated, anon, public;
      END IF;
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE public.payload_locked_documents_rels ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.payload_locked_documents_rels FROM authenticated, anon, public;
      END IF;
      IF to_regclass('public.payload_preferences') IS NOT NULL THEN
        ALTER TABLE public.payload_preferences ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.payload_preferences FROM authenticated, anon, public;
      END IF;
      IF to_regclass('public.payload_preferences_rels') IS NOT NULL THEN
        ALTER TABLE public.payload_preferences_rels ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.payload_preferences_rels FROM authenticated, anon, public;
      END IF;
      IF to_regclass('public.payload_migrations') IS NOT NULL THEN
        ALTER TABLE public.payload_migrations ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE public.payload_migrations FROM authenticated, anon, public;
      END IF;
    END $$;
  `);

  // Guarded GRANT (only on Supabase)
  await db.execute(sql`
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    GRANT SELECT ON TABLE public.role_permissions TO supabase_auth_admin;
  END IF;
END $$;
`);

  // Guarded hook activation (only if Supabase exposes the function)
  await db.execute(sql`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'set_access_token_hook'
      AND n.nspname = 'auth'
  ) THEN
    PERFORM auth.set_access_token_hook('public.custom_access_token_hook');
  END IF;
END $$;
`);

  // Guard the policy by role existence as well
  await db.execute(sql`
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='supabase_auth_admin') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname='public' AND tablename='role_permissions'
        AND policyname='Allow auth admin to read role permissions'
    ) THEN
      CREATE POLICY "Allow auth admin to read role permissions"
      ON public.role_permissions
      AS PERMISSIVE FOR SELECT
      TO supabase_auth_admin
      USING (true);
    END IF;
  END IF;
END $$;
`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop policies
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select') THEN
        DROP POLICY users_select ON public.users;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update') THEN
        DROP POLICY users_update ON public.users;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_delete') THEN
        DROP POLICY users_delete ON public.users;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_select') THEN
        DROP POLICY role_permissions_select ON public.role_permissions;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_insert') THEN
        DROP POLICY role_permissions_insert ON public.role_permissions;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_update') THEN
        DROP POLICY role_permissions_update ON public.role_permissions;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_delete') THEN
        DROP POLICY role_permissions_delete ON public.role_permissions;
      END IF;
    END $$;
  `);

  // Optionally disable RLS (safe no-op if table missing)
  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.users') IS NOT NULL THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
      END IF;
      IF to_regclass('public.role_permissions') IS NOT NULL THEN
        ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;
      END IF;
    END $$;
  `);

  // Drop helper
  await db.execute(sql`DROP FUNCTION IF EXISTS public.authorize(public.app_permission);`);
}