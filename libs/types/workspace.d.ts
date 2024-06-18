import { ComboboxData } from '@mantine/core';

export type WorkspaceCardProps = {
  wksp_name: string;
  wksp_desc: string;
  wksp_id: string;
  users: {
    user_id: number;
    usrn: string;
    email: string | null;
    avatar: string | null;
    fuln: string | null;
  }[];
};

export type WorkspaceCardPropsExpand = WorkspaceCardProps & {
  index: number;
};

export type WorkspaceType = {};
export type WorkspacePayloadType = {
  wksp_name: string;
  wksp_desc: string;
  resources: string[];
};

export type WorkspaceMemberInputType = ComboboxData &
  {
    value: number;
    label: string;
  }[];

export type WorkspaceMemberType = {
  usr_id: number;
  usrn: string;
  fuln: string;
  role: 'HM' | 'PM' | 'EM';
};
export type ResourceItemType = {
  resrc_id: string;
  resrc_name: string;
  resrc_url: string;
};
