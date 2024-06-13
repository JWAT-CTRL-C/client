import { BlogResponse } from '@/libs/types/blogResponse';
import { fetchBlogById, fetchBlogs, fetchBlogsForCurrentUser } from '@/services/blogServices';
import { useQuery } from '@tanstack/react-query';

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
