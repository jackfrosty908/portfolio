import sharp from 'sharp';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from 'payload';
import { Admins } from './payload/collections/Admins';
import { Users } from './payload/collections/Users';

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
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
});
