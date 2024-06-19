import { RolesType } from '@/libs/types';
import { AbilityBuilder, AbilityTuple, MongoAbility, MongoQuery, createMongoAbility } from '@casl/ability';

export function defineAbilities() {
  const { build } = new AbilityBuilder(createMongoAbility);
  return build();
}

export function updateAbility(ability: MongoAbility<AbilityTuple, MongoQuery>, role: RolesType | null) {
  const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case 'MA':
      can('reach', 'all');
      can('create', 'all');
      break;
    case 'HM':
      can('create', 'all');
      cannot('reach', 'Admin');
      break;
    case 'PM':
      can('create', 'blog');
      can('create', 'workspace');
      cannot('reach', 'Admin');
      break;
    case 'EM':
      can('create', 'blog');
      cannot('create', 'workspace');
      cannot('reach', 'Admin');
      break;
    default:
      cannot('read', 'all');
      break;
  }

  ability.update(rules);
  return ability;
}
