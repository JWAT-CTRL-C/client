import { BlogResponse } from '@/libs/types/blogResponse';
import {
  fetchBlogById,
  fetchBlogs,
  fetchBlogsForCurrentUser,
  filterBlogsForCurrentUserByTitle
} from '@/services/blogServices';

import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@mantine/hooks';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';



export const useFetchBlogs = () => {
  return useQuery<BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS],
    queryFn: async () => await fetchBlogs()
  });
};

export const useFetchBlogById = (blog_id: string) => {
  return useQuery<void, Error, BlogResponse>({
    queryKey: [BlogQueryEnum.BLOGS, blog_id],
    queryFn: async () => await fetchBlogById(blog_id)
  });
};
export const useFetchBlogsCurrentUser = () => {
  return useQuery<void, Error, BlogResponse[]>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
    queryFn: async () => await fetchBlogsForCurrentUser()
  });
};

export const useFetchBlogsCurrentUserByTitle = (blog_tle: string) => {
  const [debounced] = useDebouncedValue(blog_tle, 300);

  return useQuery<BlogResponse[], Error>({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER, debounced],
    queryFn: async () => await filterBlogsForCurrentUserByTitle(debounced),
    enabled: !!debounced
  });
};
