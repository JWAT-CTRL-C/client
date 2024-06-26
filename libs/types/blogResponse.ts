import { blogCommentType } from './blogCommentType';
import { blogRatingType } from './blogRatingType';
import { RolesType } from '.';
import { Tag } from './tagType';
import { workspacesType } from './workspacesType';
import { ResourceType } from './sourcesType';
import { User } from './userType';

export type BlogResponse = {
  blog_id: string;
  blog_tle: string;
  blog_cont: string;
  crd_at: string;
  upd_at: string;
  user: User;
  tags: Tag[];
  blogImage: {
    blog_img_id: string;
    blog_img_url: string;
    crd_at: string;
    upd_at: string;
  };
  blogComments: blogCommentType[];
  blogRatings: blogRatingType[];
  workspace: workspacesType;
  resource: ResourceType;
};


export type BlogResponseWithPagination = {
  data: BlogResponse[];
  totalPages: number;
  currentPage: number;
 
};
