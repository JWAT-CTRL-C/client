import { AbilityBuilder, AbilityTuple, createMongoAbility, MongoAbility, MongoQuery } from '@casl/ability';

import { User } from './types/userType';
import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { BlogResponse } from './types/blogResponse';

type Action = 'create' | 'read' | 'edit' | 'delete' | 'reach' | 'do';
type Subject =
  | 'AdminPage'
  | 'blog'
  | 'workspace'
  | 'notification'
  | 'all'
  | SPECIFIC_WORKSPACE_RESPONSE
  | BlogResponse;
type AppAbility = MongoAbility<[Action, Subject], MongoQuery>;

export function defineAbilities() {
  const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  return build();
}

export function updateAbility(ability: MongoAbility<AbilityTuple, MongoQuery>, user: User) {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (user.role) {
    case 'MA':
      can('reach', 'AdminPage');
      can('create', ['blog', 'workspace','notification']);
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
      can('edit', 'workspace', { 'owner.user_id': user.user_id });
      can('edit', 'blog', { 'user.user_id': user.user_id });
      cannot('reach', 'AdminPage');
      break;
    case 'EM':
      can('create', 'blog');
      can('edit', 'blog', { 'user.user_id': user.user_id });
      cannot('create', 'workspace');
      cannot('reach', 'AdminPage');
      break;
    default:
      cannot('do', 'all');
      break;
  }

  ability.update(rules);
  return ability;
}
