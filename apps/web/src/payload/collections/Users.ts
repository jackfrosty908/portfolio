import type { CollectionConfig } from 'payload';
import { supabaseStrategy } from '@/payload/auth/supabase-strategy';

type Claims = {
  permissions?: string[];
  user_role?: 'admin' | 'writer' | 'user' | 'public';
  user_roles?: Array<'admin' | 'writer' | 'user' | 'public'>;
};

type UserWithClaims = { id?: string; claims?: Claims } | null;

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [{ name: 'supabase', authenticate: supabaseStrategy }],
  },
  admin: { useAsTitle: 'email' },
  access: {
    admin: ({ req }) => {
      const u = req.user as UserWithClaims;
      const perms = u?.claims?.permissions ?? [];
      return Array.isArray(perms) && perms.includes('user.manage');
    },
    read: ({ req, id }) =>
      req.user ? (id ? req.user.id === id : true) : false,
    update: ({ req, id }) => (req.user ? req.user.id === id : false),
    delete: () => false,
  },
  fields: [
    { name: 'first_name', type: 'text', admin: { readOnly: true } },
    { name: 'last_name', type: 'text', admin: { readOnly: true } },
    {
      name: 'email',
      type: 'email',
      unique: true,
      required: true,
      admin: { readOnly: true },
    },
  ],
};
