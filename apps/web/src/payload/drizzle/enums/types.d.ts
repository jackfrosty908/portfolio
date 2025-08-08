import type { PgEnum } from 'drizzle-orm/pg-core';

export type GenericEnum = PgEnum<[string, ...string[]]>;
