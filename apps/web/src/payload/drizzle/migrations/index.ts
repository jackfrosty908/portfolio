import * as migration_20250809_062519_init from './20250809_062519_init';
import * as migration_20250809_062849_seed_and_auth_hooks from './20250809_062849_seed_and_auth_hooks';
import * as migration_20250809_063302_rls from './20250809_063302_rls';
import * as migration_20250809_074552_user_roles_fk from './20250809_074552_user_roles_fk';
import * as migration_20250811_083005_init_blog_posts from './20250811_083005_init_blog_posts';

export const migrations = [
  {
    up: migration_20250809_062519_init.up,
    down: migration_20250809_062519_init.down,
    name: '20250809_062519_init',
  },
  {
    up: migration_20250809_062849_seed_and_auth_hooks.up,
    down: migration_20250809_062849_seed_and_auth_hooks.down,
    name: '20250809_062849_seed_and_auth_hooks',
  },
  {
    up: migration_20250809_063302_rls.up,
    down: migration_20250809_063302_rls.down,
    name: '20250809_063302_rls',
  },
  {
    up: migration_20250809_074552_user_roles_fk.up,
    down: migration_20250809_074552_user_roles_fk.down,
    name: '20250809_074552_user_roles_fk',
  },
  {
    up: migration_20250811_083005_init_blog_posts.up,
    down: migration_20250811_083005_init_blog_posts.down,
    name: '20250811_083005_init_blog_posts'
  },
];
