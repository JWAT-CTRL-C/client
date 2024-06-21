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
      can('reach', 'AdminPage');
      can('create', ['blog', 'workspace']);
      can('edit', ['blog', 'workspace']);
      break;
    case 'HM':
      can('create', ['blog', 'workspace']);
      can('edit', ['blog', 'workspace']);
      cannot('reach', 'AdminPage');

      break;
    case 'PM':
      can('create', 'blog');
      can('create', 'workspace');
      cannot('reach', 'AdminPage');
      break;
    case 'EM':
      can('create', 'blog');
      cannot('create', 'workspace');
      cannot('reach', 'AdminPage');
      break;
    default:
      cannot('do', 'anything');
      break;
  }

  ability.update(rules);
  return ability;
}
