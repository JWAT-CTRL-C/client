import { BlogResponse } from '@/libs/types/blogResponse';
import {
  fetchBlogById,
  fetchBlogs,
  fetchBlogsForCurrentUser,
  filterBlogsForCurrentUserByTitle
} from '@/services/blogServices';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../useDebounce';

export const useFetchBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await fetchBlogs()
  });
};

export const useFetchBlogById = (blog_id: string) => {
  return useQuery<void, Error, BlogResponse>({
    queryKey: ['blogs', blog_id],
    queryFn: async () => await fetchBlogById(blog_id)
  });
};
export const useFetchBlogsCurrentUser = () => {
  return useQuery<void, Error, BlogResponse[]>({
    queryKey: ['blogs-current-user'],
    queryFn: async () => await fetchBlogsForCurrentUser()
  });
};

export const useFetchBlogsCurrentUserByTitle = (blog_tle: string) => {
  const debouncedTitle = useDebounce(blog_tle, 300);

  return useQuery<BlogResponse[], Error>({
    queryKey: ['blogs-current-user', debouncedTitle],
    queryFn: async () => await filterBlogsForCurrentUserByTitle(debouncedTitle)
    //enabled: !!debouncedTitle
  });
};

export const useFetchBlogsCurrentUserByTitle = (blog_tle: string) => {
  const debouncedTitle = useDebounce(blog_tle, 300);

  return useQuery<BlogResponse[], Error>({
    queryKey: ['blogs-current-user', debouncedTitle],
    queryFn: async () => await filterBlogsForCurrentUserByTitle(debouncedTitle)
    //enabled: !!debouncedTitle
  });
};
