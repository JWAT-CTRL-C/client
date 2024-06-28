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
  crd_at: string | Date;
  deleted_at: string | Date;
  workspaces: workspacesType[];
};

export type UserForm = {
  user_id: number;
  fuln: string;
  email: string | null;
  phone: string | null;
  role?: RolesType;
};

export type UserResponseWithPagination = {
  data: User[];
  totalPages: number;
  currentPage: number;
};

export type UserFormForAdmin = {
  user_id: number;
  usrn: string | null;
  pass: string | null;
  fuln: string | null;
  email: string | null;
  phone: string | null;
  role: RolesType;
};
