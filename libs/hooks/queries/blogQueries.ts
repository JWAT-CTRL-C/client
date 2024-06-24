import { BlogResponse } from '@/libs/types/blogResponse';
import {
  fetchBlogById,
  fetchBlogs,
  fetchBlogsForCurrentUser,
  fetchRecentBlogs,
  fetchRelatedBlogs,
  fetchWorkspacesInfo,
  filterBlogsForCurrentUserByTitle
} from '@/services/blogServices';

import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@mantine/hooks';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { workspacesType } from '@/libs/types/workspacesType';

export const useFetchBlogs = () => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS],
    queryFn: () => fetchBlogs()
  });
};

export const useFetchRecentBlogs = () => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_RECENT],
    queryFn: () => fetchRecentBlogs()
  });
};

export const useFetchBlogById = (blog_id: string) => {
  return useQuery<BlogResponse, Error>({
    queryKey: [BlogQueryEnum.BLOGS, blog_id],
    queryFn: () => fetchBlogById(blog_id)
  });
};

export const useFetchBlogsCurrentUser = () => {
  return useQuery<BlogResponse[], Error>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
    queryFn: () => fetchBlogsForCurrentUser()
  });
};

export const useFetchBlogsCurrentUserByTitle = (blog_tle: string) => {
  const [debounced] = useDebouncedValue(blog_tle, 300);

  return useQuery<BlogResponse[], Error>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER, debounced],
    queryFn: () => filterBlogsForCurrentUserByTitle(debounced),
    enabled: !!debounced
  });
};

export const useFetchRelatedBlog = (blog_id: string) => {
  return useQuery<BlogResponse[], Error>({
    queryKey: [BlogQueryEnum.BLOGS_RELATED, blog_id],
    queryFn: () => fetchRelatedBlogs(blog_id)
  });
};

export const useFetchWorkSpaceInfo = () => {
  return useQuery<Pick<workspacesType, 'wksp_id' | 'wksp_name' | 'resources'>[], Error>({
    queryKey: [BlogQueryEnum.BLOGS_WORKSPACES_INFO],
    queryFn: () => fetchWorkspacesInfo()
  });
};
