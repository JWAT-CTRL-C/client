import { User } from './userType';
import { WorkspacePayloadType } from './workspace';

export type Noti = {
  noti_id: string;

  noti_tle: string;

  noti_cont: string;

  user: User;

  workspace: WorkspacePayloadType;

  crd_at: string;
};
