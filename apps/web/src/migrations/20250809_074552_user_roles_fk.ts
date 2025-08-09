import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Drop any old unique index on user_id
    DROP INDEX IF EXISTS user_roles_user_id_key;

    -- Drop existing PK (likely on user_id)
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_roles_pkey' AND conrelid = 'public.user_roles'::regclass
      ) THEN
        ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_pkey;
      END IF;
    END $$;

    -- Add composite PK (user_id, role)
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_roles_pkey' AND conrelid = 'public.user_roles'::regclass
      ) THEN
        ALTER TABLE public.user_roles
          ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role);
      END IF;
    END $$;

    -- Ensure FK to users(id)
    DO $$
    BEGIN
      BEGIN
        ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_fk;
      EXCEPTION WHEN duplicate_object THEN
        NULL;
      END;
    END $$;

    -- Helpful index for queries by user
    CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles (user_id);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Drop FK and composite PK
    ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_fk;
    ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;

    -- Restore single-column PK on user_id (WARNING: will fail if multiple rows per user exist)
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_roles_pkey' AND conrelid = 'public.user_roles'::regclass
      ) THEN
        ALTER TABLE public.user_roles
          ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id);
      END IF;
    END $$;

    -- Optional: drop the helper index (PK already indexes user_id)
    DROP INDEX IF EXISTS user_roles_user_id_idx;
  `);
}
