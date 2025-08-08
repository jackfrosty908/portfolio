import * as migration_20250808_091536_initial_roles from './20250808_091536_initial_roles';
import * as migration_20250808_092859_seed_role_permissions from './20250808_092859_seed_role_permissions';
import * as migration_20250808_212339_auth_hook_user_roles from './20250808_212339_auth_hook_user_roles';
import * as migration_20250808_221956_rls_and_authorize from './20250808_221956_rls_and_authorize';

export const migrations = [
  {
    up: migration_20250808_091536_initial_roles.up,
    down: migration_20250808_091536_initial_roles.down,
    name: '20250808_091536_initial_roles',
  },
  {
    up: migration_20250808_092859_seed_role_permissions.up,
    down: migration_20250808_092859_seed_role_permissions.down,
    name: '20250808_092859_seed_role_permissions',
  },
  {
    up: migration_20250808_212339_auth_hook_user_roles.up,
    down: migration_20250808_212339_auth_hook_user_roles.down,
    name: '20250808_212339_auth_hook_user_roles',
  },
  {
    up: migration_20250808_221956_rls_and_authorize.up,
    down: migration_20250808_221956_rls_and_authorize.down,
    name: '20250808_221956_rls_and_authorize'
  },
];
