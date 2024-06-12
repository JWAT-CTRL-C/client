import { Tag } from './tagType';

export type BlogCardType = {
  blog_id: number | string;
  blog_tle: string;
  blog_cont: string;
  crd_at: string | Date;
  blog_image: string | null | undefined;
  auth_img?: string | null;
  auth_name: string;
  blog_rtg: number;
  blog_tag: Tag[];
};
