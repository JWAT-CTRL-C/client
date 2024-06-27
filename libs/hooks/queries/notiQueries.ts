import { useQuery } from '@tanstack/react-query';
import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { fetchNotifications, fetchWorkspaceNotifications, getUnreadAmount } from '@/services/notiServices';

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async () => await fetchNotifications()
  });
};
export const useFetchWorkspaceNotifications = (wksp_id: string) => {
  const { data } = useQuery({
    queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
    queryFn: async () => await fetchWorkspaceNotifications(wksp_id)
  });
  return {
    notifications: data
  };
};
export const useFetchUnreadAmount = () => {
  const { data } = useQuery({
    queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION],
    queryFn: async () => await getUnreadAmount()
  });
  return {
    unreadAmount: data
  };
};
