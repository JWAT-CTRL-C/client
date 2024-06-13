import { ResourceType } from './sourcesType';

export type workspacesType = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  users: User[];
  resources: ResourceType[] | [];
};

type User = {
  user_id: number;
  usrn: string;
  email: null;
  fuln: string;
  role: string;
};
