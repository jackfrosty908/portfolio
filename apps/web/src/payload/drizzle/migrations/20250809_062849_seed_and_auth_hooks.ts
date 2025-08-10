import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) Seed role_permissions (idempotent)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_role_permission_key
    ON public.role_permissions (role, permission);
  `);

  await db.execute(sql`
    INSERT INTO public.role_permissions (role, permission)
    VALUES
      ('admin','content.create'),
      ('admin','content.read'),
      ('admin','content.update'),
      ('admin','content.delete'),
      ('admin','content.update.others'),
      ('admin','content.delete.others'),
      ('admin','comment.create'),
      ('admin','comment.read'),
      ('admin','comment.update'),
      ('admin','comment.delete'),
      ('admin','comment.update.others'),
      ('admin','comment.delete.others'),
      ('admin','user.manage'),

      ('writer','content.create'),
      ('writer','content.read'),
      ('writer','content.update'),
      ('writer','content.delete'),
      ('writer','comment.create'),
      ('writer','comment.read'),
      ('writer','comment.update'),
      ('writer','comment.delete'),

      ('user','content.read'),
      ('user','comment.create'),
      ('user','comment.read'),
      ('user','comment.update'),
      ('user','comment.delete'),

      ('public','content.read'),
      ('public','comment.read')
    ON CONFLICT DO NOTHING;
  `);

  // 2) custom_access_token_hook (inject user_role into JWT)
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
    RETURNS jsonb
    LANGUAGE plpgsql
    STABLE
    AS $$
    DECLARE
      claims jsonb;
      roles public.app_role[];
      user_role public.app_role;
      perms text[];
    BEGIN
      SELECT array_agg(ur.role) INTO roles
      FROM public.user_roles ur
      WHERE ur.user_id = (event->>'user_id')::uuid;

      user_role := COALESCE(roles[1], NULL);

      SELECT array_agg(DISTINCT rp.permission::text) INTO perms
      FROM public.role_permissions rp
      WHERE roles IS NOT NULL AND rp.role = ANY(roles);

      claims := event->'claims';

      IF user_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
      ELSE
        claims := jsonb_set(claims, '{user_role}', 'null');
      END IF;

      claims := jsonb_set(claims, '{user_roles}', COALESCE(to_jsonb(roles), '[]'::jsonb));
      claims := jsonb_set(claims, '{permissions}', COALESCE(to_jsonb(perms), '[]'::jsonb));

      event := jsonb_set(event, '{claims}', claims);
      RETURN event;
    END;
    $$;
  `);

  // 3) Grants + RLS for user_roles (Auth reads it with supabase_auth_admin)
  await db.execute(sql`
DO $$
BEGIN
  -- Only on Supabase (role exists)
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
    GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
    GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;
    GRANT SELECT ON TABLE public.role_permissions TO supabase_auth_admin;
  END IF;

  -- Always safe to revoke from PUBLIC; conditionally revoke from Supabase roles
  REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM PUBLIC;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM anon;
  END IF;
END $$;
`);

  await db.execute(sql`ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`);

  await db.execute(sql`
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='supabase_auth_admin') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname='public' AND tablename='user_roles'
        AND policyname='Allow auth admin to read user roles'
    ) THEN
      CREATE POLICY "Allow auth admin to read user roles"
      ON public.user_roles
      AS PERMISSIVE FOR SELECT
      TO supabase_auth_admin
      USING (true);
    END IF;
  END IF;
END $$;
`);

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

  // Set the access token hook only when Supabase provides the function
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
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.role_permissions') IS NOT NULL THEN
        DELETE FROM public.role_permissions
        WHERE (role, permission) IN (
          ('admin','content.create'), ('admin','content.read'), ('admin','content.update'), ('admin','content.delete'),
          ('admin','content.update.others'), ('admin','content.delete.others'),
          ('admin','comment.create'), ('admin','comment.read'), ('admin','comment.update'), ('admin','comment.delete'),
          ('admin','comment.update.others'), ('admin','comment.delete.others'),
          ('admin','user.manage'),

          ('writer','content.create'), ('writer','content.read'), ('writer','content.update'), ('writer','content.delete'),
          ('writer','comment.create'), ('writer','comment.read'), ('writer','comment.update'), ('writer','comment.delete'),

          ('user','content.read'), ('user','comment.create'), ('user','comment.read'), ('user','comment.update'), ('user','comment.delete'),

          ('public','content.read'), ('public','comment.read')
        );
      END IF;
    END $$;
    DROP INDEX IF EXISTS role_permissions_role_permission_key;
  `);
}