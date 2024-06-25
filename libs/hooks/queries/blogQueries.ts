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

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@mantine/hooks';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { workspacesType } from '@/libs/types/workspacesType';

export const useFetchBlogs = () => {
  return useInfiniteQuery({
    queryKey: [BlogQueryEnum.BLOGS_INFINITE],
    queryFn: ({ pageParam }) => fetchBlogs(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => (lastPage?.length < 12 ? null : lastPageParam + 1),
    select: (data) => data.pages.flat()
  });
};

export const useFetchRecentBlogs = () => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_RECENT],
    queryFn: () => fetchRecentBlogs()
  });
};

export const useFetchBlogById = (blog_id: string) => {
  return useQuery<BlogResponse>({
    queryKey: [BlogQueryEnum.BLOGS, blog_id],
    queryFn: () => fetchBlogById(blog_id)
  });
};

export const useFetchBlogsCurrentUser = () => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
    queryFn: () => fetchBlogsForCurrentUser()
  });
};

export const useFetchBlogsCurrentUserByTitle = (blog_tle: string) => {
  const [debounced] = useDebouncedValue(blog_tle, 300);

  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER, debounced],
    queryFn: () => filterBlogsForCurrentUserByTitle(debounced),
    enabled: !!debounced
  });
};

export const useFetchRelatedBlog = (blog_id: string) => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_RELATED, blog_id],
    queryFn: () => fetchRelatedBlogs(blog_id)
  });
};

export const useFetchWorkSpaceInfo = () => {
  return useQuery<Pick<workspacesType, 'wksp_id' | 'wksp_name' | 'resources'>[]>({
    queryKey: [BlogQueryEnum.BLOGS_WORKSPACES_INFO],
    queryFn: () => fetchWorkspacesInfo()
  });
};
