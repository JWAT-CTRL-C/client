import { QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '../constants/queryKeys/user';
import { fetchUserById } from '@/services/userServices';

export const prefetchMyInfo = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [MY_INFO_KEY],
    queryFn: async () => await fetchUserById('me')
  });
