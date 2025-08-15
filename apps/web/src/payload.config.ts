import { postgresAdapter } from '@payloadcms/db-postgres';
import { uuid } from '@payloadcms/db-postgres/drizzle/pg-core';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { Posts } from './payload/collections/posts';
import { Tags } from './payload/collections/tags';
import { Users } from './payload/collections/users';
import { appPermissionEnum } from './payload/drizzle/enums/app-permissions';
import { appRoleEnum } from './payload/drizzle/enums/app-roles';
import { rolePermissions } from './payload/drizzle/tables/role-permissions';
import { userRoles } from './payload/drizzle/tables/user-roles';

export default buildConfig({
  admin: { user: 'users' },
  // If you'd like to use Rich Text, pass your editor here
  //TODO: investigate replacing with plate.js editor
  editor: lexicalEditor(),

  // Define and configure collections in this array
  collections: [Users, Posts, Tags],
  // Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // `pool` is required.
    pool: {
      connectionString: process.env.POSTGRES_DATABASE_URI,
    },

    migrationDir: './src/payload/drizzle/migrations',
    push: false, // Disable push to avoid conflicts with migrations
    idType: 'uuid', // use UUID v4 for all collection IDs
    // Add custom tables here so Payload knows about them
    beforeSchemaInit: [
      ({ schema }) => ({
        ...schema,
        tables: {
          ...schema.tables,
          rolePermissions,
          userRoles,
        },
        enums: {
          ...schema.enums,
          [appRoleEnum.enumName]: appRoleEnum,
          [appPermissionEnum.enumName]: appPermissionEnum,
        },
      }),
    ],
    afterSchemaInit: [
      ({ schema, extendTable }) => {
        for (const [tableName, table] of Object.entries(schema.tables)) {
          const columns: Record<string, ReturnType<typeof uuid>> = {};

          // Only force UUID for the users PK
          if (tableName === 'users' && 'id' in table) {
            columns.id = uuid('id').primaryKey();
          }

          // Force UUID for FKs to users
          for (const [colKey, col] of Object.entries(table)) {
            const colName = (col as { name?: string })?.name;
            if (colName === 'users_id' || colName === 'author_id') {
              columns[colKey] = uuid(colName);
            }
          }

          if (Object.keys(columns).length) {
            extendTable({ table: schema.tables[tableName], columns });
          }
        }
        return schema;
      },
    ],
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  // import sharp from 'sharp';
  // sharp, TODO: will probably want this for images in the future
});
