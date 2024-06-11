import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { UserRole } from '@/libs/types';

export default function defineAbilitiesFor(role?: UserRole) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case UserRole.MA:
      can('manage', 'all');
      break;
    case UserRole.HM:
      can('read', 'all');
      can('create', 'all');
      can('update', 'all');
      can('delete', 'all');
      break;
    case UserRole.PM:
      can('read', 'all');
      can('create', 'all');
      can('update', 'all');
      can('delete', 'all');
      break;
    case UserRole.EM:
      can('read', 'all');
      can('create', 'all');
      can('update', 'all');
      can('delete', 'all');
      break;
    default:
      break;
  }

  return build();
}
