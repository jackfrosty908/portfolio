import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { Admins } from './payload/collections/Admins';
import { Users } from './payload/collections/Users';
import { appPermissionEnum } from './payload/drizzle/enums/appPermissions';
import { appRoleEnum } from './payload/drizzle/enums/appRoles';
import { rolePermissions } from './payload/drizzle/tables/role_permissions';
import { userRoles } from './payload/drizzle/tables/user_roles';

export default buildConfig({
  admin: {
    user: 'admins',
  },
  // If you'd like to use Rich Text, pass your editor here
  //TODO: investigate replacing with plate.js editor
  editor: lexicalEditor(),

  // Define and configure collections in this array
  collections: [Admins, Users],

  // Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // `pool` is required.
    pool: {
      connectionString: process.env.POSTGRES_DATABASE_URI,
    },
    push: false, // Disable push to avoid conflicts with migrations
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
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  // import sharp from 'sharp';
  // sharp, TODO: will probably want this for images in the future
});
