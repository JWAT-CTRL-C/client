import { fetchNotifications, fetchWorkspaceNotifications, getUnreadAmount } from '@/services/notiServices';
import { QueryClient } from '@tanstack/react-query';
import { NotiQueryEnum } from '../constants/queryKeys/noti';

export const prefetchNotifications = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async () => await fetchNotifications()
  });

export const prefetchWorkspaceNotifications = async (queryClient: QueryClient, wksp_id: string) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
    queryFn: async () => await fetchWorkspaceNotifications(wksp_id)
  });
export const prefetchUnreadAmount = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION],
    queryFn: async () => await getUnreadAmount()
  });
