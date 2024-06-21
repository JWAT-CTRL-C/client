import { blogCommentType } from './blogCommentType';
import { blogImage } from './blogImageType';
import { blogRatingType } from './blogRatingType';
import { Tag } from './tagType';
import { User } from './userType';

export type BlogCardType = {
  blog_id: number | string;
  blog_tle: string;
  blog_cont: string;
  crd_at: string | Date;
  blog_image: blogImage;
  auth_img?: string | null;
  auth_name: string;
  blog_rtg: blogRatingType[];
  blog_tag: Tag[];
  user: User;
};
