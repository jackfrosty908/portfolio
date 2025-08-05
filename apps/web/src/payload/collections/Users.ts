import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
      unique: true,
    },
    {
      name: 'supabaseId',
      type: 'text',
      unique: true,
    },
  ],
}; 