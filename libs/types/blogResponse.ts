import { blogCommentType } from './blogCommentType';
import { blogRatingType } from './blogRatingType';
import { RolesType } from '.';
import { Tag } from './tagType';

export type BlogResponse = {
  blog_id: string;
  blog_tle: string;
  blog_cont: string;
  crd_at: string;
  upd_at: string;
  user: {
    user_id: number;
    usrn: string;
    email: string;
    fuln: string;
    phone: string;
    pass: string;
    role: RolesType;
    deleted_at: string | null;
    crd_at: string;
    upd_at: string;
    avatar: string;
  };
  tags: Tag[];
  blogImage: {
    blog_img_id: string;
    blog_img_url: string;
    crd_at: string;
    upd_at: string;
  };
  blogComments: blogCommentType[];
  blogRatings: blogRatingType[];
  workspace: any;
  resource: any;
};
