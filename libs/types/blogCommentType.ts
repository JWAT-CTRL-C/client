import { User } from './userType';

export type blogCommentType = {
  blog_cmt_id: string;
  blog_cmt_cont: string;
  crd_at: string | Date;
  upd_at: string | Date;
  user: User;
};
