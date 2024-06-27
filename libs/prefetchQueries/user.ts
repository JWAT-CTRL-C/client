import { QueryClient } from '@tanstack/react-query';
import { GET_ALL_USERS_FOR_ADMIN_KEY, MY_INFO_KEY } from '../constants/queryKeys/user';
import { fetchUserById, getAllUsersForAdmin } from '@/services/userServices';

export const prefetchMyInfo = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [MY_INFO_KEY],
    queryFn: async () => await fetchUserById('me')
  });

export const prefetchUsersAdmin = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY, 1],
    queryFn: async () => await getAllUsersForAdmin(1)
  });
