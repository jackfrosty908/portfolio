import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) authorize() reads role from JWT and checks role_permissions
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

  // 2) Enable RLS on app tables (not payload_*)
  await db.execute(sql`ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`);
  await db.execute(
    sql`ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;`
  );

  // SELECT allowed only for managers
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_select'
      ) THEN
        CREATE POLICY role_permissions_select ON public.role_permissions
        FOR SELECT TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // INSERT guarded by user.manage
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_insert'
      ) THEN
        CREATE POLICY role_permissions_insert ON public.role_permissions
        FOR INSERT TO authenticated
        WITH CHECK ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // UPDATE guarded by user.manage
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_update'
      ) THEN
        CREATE POLICY role_permissions_update ON public.role_permissions
        FOR UPDATE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)))
        WITH CHECK ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // DELETE guarded by user.manage
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname='public' AND tablename='role_permissions' AND policyname='role_permissions_delete'
      ) THEN
        CREATE POLICY role_permissions_delete ON public.role_permissions
        FOR DELETE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);

  // 3) Policies (idempotent) — adjust to your model
  // admins: allow self read; admins (user.manage) can read all
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_select'
      ) THEN
        CREATE POLICY admins_select ON public.admins
        FOR SELECT TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        );
      END IF;
    END $$;
  `);

  // admins: updates only by self or user.manage
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_update'
      ) THEN
        CREATE POLICY admins_update ON public.admins
        FOR UPDATE TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        )
        WITH CHECK (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        );
      END IF;
    END $$;
  `);

  // users: same pattern
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select'
      ) THEN
        CREATE POLICY users_select ON public.users
        FOR SELECT TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        );
      END IF;
    END $$;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update'
      ) THEN
        CREATE POLICY users_update ON public.users
        FOR UPDATE TO authenticated
        USING (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        )
        WITH CHECK (
          (SELECT authorize('user.manage'::public.app_permission))
          OR (supabase_id IS NOT NULL AND supabase_id = (SELECT auth.uid())::text)
        );
      END IF;
    END $$;
  `);

  // Optional: DELETE for admins/users only for user.manage
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_delete'
      ) THEN
        CREATE POLICY users_delete ON public.users
        FOR DELETE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_delete'
      ) THEN
        CREATE POLICY admins_delete ON public.admins
        FOR DELETE TO authenticated
        USING ((SELECT authorize('user.manage'::public.app_permission)));
      END IF;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop policies if present
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_select') THEN
        DROP POLICY admins_select ON public.admins;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_update') THEN
        DROP POLICY admins_update ON public.admins;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='admins_delete') THEN
        DROP POLICY admins_delete ON public.admins;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select') THEN
        DROP POLICY users_select ON public.users;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_update') THEN
        DROP POLICY users_update ON public.users;
      END IF;
      IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_delete') THEN
        DROP POLICY users_delete ON public.users;
      END IF;
    END $$;
  `);

  // Drop role_permissions policies if present
  await db.execute(sql`
    DO $$ BEGIN
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

  // Disable RLS (optional)
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.admins') IS NOT NULL THEN
        ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
      END IF;

      IF to_regclass('public.users') IS NOT NULL THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
      END IF;

      IF to_regclass('public.user_roles') IS NOT NULL THEN
        ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
      END IF;
    END $$;
  `);

  // Drop function
  await db.execute(
    sql`DROP FUNCTION IF EXISTS public.authorize(public.app_permission);`
  );
}
