import { AbilityBuilder, AbilityTuple, createMongoAbility, MongoAbility, MongoQuery } from '@casl/ability';

import { User } from './types/userType';
import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { BlogResponse } from './types/blogResponse';

export type AbilityAction = 'create' | 'read' | 'edit' | 'delete' | 'reach' | 'do';
export type AbilitySubject =
  | 'AdminPage'
  | 'blog'
  | 'workspace'
  | 'global_notification'
  | 'all'
  | SPECIFIC_WORKSPACE_RESPONSE
  | BlogResponse
  | 'BlogsAdminPage'
  | 'WorkspacesAdminPage' | 'NotificationsAdminPage';
export type AppAbility = MongoAbility<[AbilityAction, AbilitySubject], MongoQuery>;

export function defineAbilities() {
  const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  return build();
}

export function updateAbility(ability: MongoAbility<AbilityTuple, MongoQuery>, user: User) {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (user.role) {
    case 'MA':
      can('reach', 'AdminPage');
      can('create', ['blog', 'workspace', 'global_notification']);
      can('edit', ['blog', 'workspace']);
      can('reach', 'BlogsAdminPage');
      can('reach', 'WorkspacesAdminPage');
      can('reach', 'NotificationsAdminPage');

      can('reach', 'workspace');

      break;
    case 'HM':
      can('create', ['blog', 'workspace']);
      can('edit', ['blog', 'workspace']);
      cannot('reach', 'AdminPage');
      cannot('reach', 'BlogsAdminPage');
      cannot('reach', 'WorkspacesAdminPage');
      cannot('reach', 'NotificationsAdminPage');

      can('reach', 'workspace');

      break;
    case 'PM':
      can('create', 'blog');
      can('create', 'workspace');
      can(['edit', 'reach'], 'workspace', { 'owner.user_id': user.user_id });
      can('edit', 'blog', { 'user.user_id': user.user_id });
      cannot('reach', 'AdminPage');
      cannot('reach', 'BlogsAdminPage');
      cannot('reach', 'WorkspacesAdminPage');
      cannot('reach', 'NotificationsAdminPage');


      break;
    case 'EM':
      can('create', 'blog');
      can('edit', 'blog', { 'user.user_id': user.user_id });
      cannot('create', 'workspace');
      cannot('reach', 'AdminPage');
      cannot('reach', 'BlogsAdminPage');
      cannot('reach', 'WorkspacesAdminPage');
      cannot('reach', 'NotificationsAdminPage');


      break;
    default:
      cannot('do', 'all');
      break;
  }

  ability.update(rules);
  return ability;
}
