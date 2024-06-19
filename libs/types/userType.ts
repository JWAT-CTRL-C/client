import { RolesType } from '.';
import { workspacesType } from './workspacesType';

export type User = {
  user_id: number;
  usrn: string;
  fuln: string;
  avatar: string;
  email: string;
  phone: string;
  role: RolesType;
  workspaces: workspacesType[];
};

export type UserForm = {
  user_id: number;
  fuln: string;
  email: string | null;
  phone: string | null;
};
