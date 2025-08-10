import { bigint, pgTable } from '@payloadcms/db-postgres/drizzle/pg-core';
import { appPermissionEnum } from '../enums/app-permissions';
import { appRoleEnum } from '../enums/app-roles';

// Define your enums

export const rolePermissions = pgTable('role_permissions', {
  id: bigint('id', { mode: 'number' })
    .generatedByDefaultAsIdentity()
    .primaryKey(),
  role: appRoleEnum('role').notNull(),
  permission: appPermissionEnum('permission').notNull(),
});
