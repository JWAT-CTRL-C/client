import { User } from "./userType";

export type blogRatingType = {
  blog_rtg_id: string;
  blog_rtg: number;
  is_rated: boolean;
  crd_at: string | Date;
  upd_at: string | Date;
  user:User
};
