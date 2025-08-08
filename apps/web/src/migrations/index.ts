import * as migration_20250808_091536_initial_roles from './20250808_091536_initial_roles';
import * as migration_20250808_092859_seed_role_permissions from './20250808_092859_seed_role_permissions';

export const migrations = [
  {
    up: migration_20250808_091536_initial_roles.up,
    down: migration_20250808_091536_initial_roles.down,
    name: '20250808_091536_initial_roles',
  },
  {
    up: migration_20250808_092859_seed_role_permissions.up,
    down: migration_20250808_092859_seed_role_permissions.down,
    name: '20250808_092859_seed_role_permissions'
  },
];
