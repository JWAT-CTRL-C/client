import { QueryClient } from '@tanstack/react-query';
import { BlogQueryEnum } from '../constants/queryKeys/blog';
import {
  fetchBlogById,
  fetchBlogs,
  fetchBlogsForCurrentUser,
  fetchRelatedBlogs,
  fetchWorkspacesInfo
} from '@/services/blogServices';

export const prefetchBlogs = async (queryClient: QueryClient) =>
  await queryClient.prefetchInfiniteQuery({
    queryKey: [BlogQueryEnum.BLOGS],
    queryFn: async ({ pageParam }) => await fetchBlogs(pageParam),
    initialPageParam: 1
  });

export const prefetchCurrentUserBlogs = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER, 1, ''],
    queryFn: async () => await fetchBlogsForCurrentUser(1, '')
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

export const prefetchWorkspaceInfo = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [BlogQueryEnum.BLOGS_WORKSPACES_INFO],
    queryFn: async () => await fetchWorkspacesInfo()
  });
