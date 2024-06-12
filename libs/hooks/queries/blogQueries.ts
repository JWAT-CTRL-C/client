import { BlogResponse } from '@/libs/types/blogResponse';
import { fetchBlogById, fetchBlogs, fetchBlogsForCurrentUser } from '@/services/blogServices';
import { useQuery } from '@tanstack/react-query';

export const useFetchBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await fetchBlogs()
    // enabled: !!getUserAuth()
  });
};

export const useFetchBlogById = (blog_id: string) => {
  return useQuery<void, Error, BlogResponse>({
    queryKey: ['blogs', blog_id],
    queryFn: async () => await fetchBlogById(blog_id)
    // enabled: !!getUserAuth()
  });
};
export const useFetchBlogsCurrentUser = () => {
  return useQuery<void, Error, BlogResponse[]>({
    queryKey: ['blogs-curent-user'],
    queryFn: async () => await fetchBlogsForCurrentUser()
    // enabled: !!getUserAuth()
  });
};
