import { RolesType } from '.';
import { ResourceType } from './sourcesType';

export type workspacesType = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  users: User[];
  owner: Owner;
  resources: ResourceType[] | [];
};

type User = {
  user_id: number;
  usrn: string;
  email: null;
  fuln: string;
  role: RolesType;
};
export type Owner = {
  user_id: number;
  usrn: string;
  role: RolesType;
};
