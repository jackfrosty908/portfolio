import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Enforce uniqueness to prevent duplicates
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_role_permission_key
    ON public.role_permissions (role, permission);
  `);

  await db.execute(sql`
    INSERT INTO public.role_permissions (role, permission)
    VALUES
      ('admin', 'content.create'),
      ('admin', 'content.read'),
      ('admin', 'content.update'),
      ('admin', 'content.delete'),
      ('admin', 'content.update.others'),
      ('admin', 'content.delete.others'),
      ('admin', 'comment.create'),
      ('admin', 'comment.read'),
      ('admin', 'comment.update'),
      ('admin', 'comment.delete'),
      ('admin', 'comment.update.others'),
      ('admin', 'comment.delete.others'),
      ('admin', 'user.manage'),

      ('writer', 'content.create'),
      ('writer', 'content.read'),
      ('writer', 'content.update'),
      ('writer', 'content.delete'),
      ('writer', 'comment.create'),
      ('writer', 'comment.read'),
      ('writer', 'comment.update'),
      ('writer', 'comment.delete'),

      ('user', 'content.read'),
      ('user', 'comment.create'),
      ('user', 'comment.read'),
      ('user', 'comment.update'),
      ('user', 'comment.delete'),

      ('public', 'content.read'),
      ('public', 'comment.read')
    ON CONFLICT DO NOTHING;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM public.role_permissions
    WHERE (role, permission) IN (
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
    );
    DROP INDEX IF EXISTS role_permissions_role_permission_key;
  `);
}
