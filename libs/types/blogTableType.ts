import { blogCommentType } from './blogCommentType';
import { blogRatingType } from './blogRatingType';
import { Tag } from './tagType';

export type blogTableType = {
  blog_id: string;
  blog_tle: string;
  blog_cont: string;
  crd_at: string | Date;
  upd_at: string | Date;
  blog_tag: Tag[];
  blog_cmt: blogCommentType[];
  blog_rtg: blogRatingType[];
  blog_img_url?: string;
};

