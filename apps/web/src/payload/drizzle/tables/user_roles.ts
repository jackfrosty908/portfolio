import { pgTable, uuid } from '@payloadcms/db-postgres/drizzle/pg-core';
import { appRoleEnum } from '../enums/appRoles';

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').primaryKey(),
  role: appRoleEnum('role').notNull().default('user'),
});
