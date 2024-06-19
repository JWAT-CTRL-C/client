import { RolesType } from '.';

export type User = {
  user_id: number;
  usrn: string;
  fuln: string;
  avatar: string;
  email: string;
  phone: string;
  role: RolesType;
};

export type UserForm = {
  user_id: number;
  fuln: string;
  email: string | null;
  phone: string | null;
};
