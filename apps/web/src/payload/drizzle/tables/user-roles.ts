import {
  index,
  pgTable,
  primaryKey,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core';
import { appRoleEnum } from '../enums/app-roles';

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id').notNull(),
    role: appRoleEnum('role').notNull(),
  },
  (t) => [
    primaryKey({ name: 'user_roles_pkey', columns: [t.userId, t.role] }),
    index('user_roles_user_id_idx').on(t.userId),
  ]
);
