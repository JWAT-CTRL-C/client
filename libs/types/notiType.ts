import { User } from './userType';
import { workspacesType } from './workspacesType';

export type Noti = {
  noti_id: string;

  noti_tle: string;

  noti_cont: string;

  user: User;

  workspace: workspacesType;

  crd_at: string;

  is_read: boolean;
};

export type NotificationResponseWithPagination = {
  data: Noti[];
  totalPages: number;
  currentPage: number;
};
