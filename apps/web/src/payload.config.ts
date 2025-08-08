import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { Admins } from './payload/collections/Admins';
import { Users } from './payload/collections/Users';
import { appPermissionEnum } from './payload/drizzle/enums/appPermissions';
import { appRoleEnum } from './payload/drizzle/enums/appRoles';
import { rolePermissions } from './payload/drizzle/tables/role_permissions';

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [Admins, Users],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // `pool` is required.
    pool: {
      connectionString: process.env.POSTGRES_DATABASE_URI,
    },
    push: false, // Disable push to avoid conflicts with migrations
    // Add your custom table here so Payload knows about it
    beforeSchemaInit: [
      ({ schema }) => {
        return {
          ...schema,
          tables: {
            ...schema.tables,
            rolePermissions,
          },
          enums: {
            ...schema.enums,
            [appRoleEnum.enumName]: appRoleEnum,
            [appPermissionEnum.enumName]: appPermissionEnum,
          },
        };
      },
    ],
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
});
