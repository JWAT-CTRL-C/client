import { QueryClient } from '@tanstack/react-query';
import { BlogQueryEnum } from '../constants/queryKeys/blog';
import {
  fetchBlogById,
  fetchBlogs,
  fetchBlogsForCurrentUser,
  fetchRelatedBlogs
} from '@/services/blogServices';

export const prefetchBlogs = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS],
    queryFn: fetchBlogs
  });

export const prefetchCurrentUserBlogs = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
    queryFn: async () => await fetchBlogsForCurrentUser()
  });

export const prefetchBlogById = async (queryClient: QueryClient, id: string) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS, id as string],
    queryFn: async () => await fetchBlogById(id as string)
  });

export const prefetchRelatedBlogs = async (queryClient: QueryClient, id: string) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS_RELATED],
    queryFn: async () => await fetchRelatedBlogs(id as string)
  });
