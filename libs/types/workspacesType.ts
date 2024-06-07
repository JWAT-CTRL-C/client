import { sourceType } from './sourcesType';

export type workspacesType = {
  workspaceId: string;
  workspaceName: string;
  workspaceDes: string;
  sources: sourceType[] | [];
};
