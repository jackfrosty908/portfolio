import { pgEnum } from '@payloadcms/db-postgres/drizzle/pg-core';
import type { GenericEnum } from './types.d';

export const appPermissionEnum: GenericEnum = pgEnum('app_permission', [
  'content.create',
  'content.read',
  'content.update',
  'content.delete',
  'content.update.others',
  'content.delete.others',
  'comment.create',
  'comment.read',
  'comment.update',
  'comment.delete',
  'comment.update.others',
  'comment.delete.others',
  'user.manage',
]);
