import { fetchNotifications, fetchWorkspaceNotifications, getUnreadAmount } from '@/services/notiServices';
import { QueryClient } from '@tanstack/react-query';
import { NotiQueryEnum } from '../constants/queryKeys/noti';

export const prefetchWorkspaceNotifications = async (queryClient: QueryClient, wksp_id: string) =>
  await queryClient.prefetchInfiniteQuery({
    queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
    queryFn: async ({ pageParam }) => await fetchWorkspaceNotifications(pageParam, wksp_id),
    initialPageParam: 1
  });
export const prefetchUnreadAmount = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION],
    queryFn: async () => await getUnreadAmount()
  });
