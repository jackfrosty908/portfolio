import { pgEnum } from '@payloadcms/db-postgres/drizzle/pg-core';
import type { GenericEnum } from './types';

export const appRoleEnum: GenericEnum = pgEnum('app_role', [
  'admin',
  'writer',
  'user',
  'public',
]);
