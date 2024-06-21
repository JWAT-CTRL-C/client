import { fetchNotifications } from '@/services/notiServices';
import { QueryClient } from '@tanstack/react-query';
import { NotiQueryEnum } from '../constants/queryKeys/noti';

export const prefetchNotifications = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async () => await fetchNotifications()
  });
