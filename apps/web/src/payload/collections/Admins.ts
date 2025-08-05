import type { CollectionConfig } from 'payload';
import { supabaseStrategy } from '../auth/supabase-strategy';

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'supabase',
        authenticate: supabaseStrategy,
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      unique: true,
    },
    {
      name: 'supabaseId',
      type: 'text',
      unique: true,
    },
  ],
}; 