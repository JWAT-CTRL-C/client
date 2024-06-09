import { blogCommentType } from './blogCommentType';
import { blogRatingType } from './blogRatingType';
import { Tag } from './tagType';

export type blogTableType = {
  blog_id: number;
  blog_tle: string;
  blog_cmt: blogCommentType[];
  blog_rtg: blogRatingType[];
  blog_tag: Tag[];
  crd_at: string | Date;
  upd_at: string | Date;
};


