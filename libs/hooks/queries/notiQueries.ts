import { useQuery } from '@tanstack/react-query';
import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { fetchNotifications } from '@/services/notiServices';

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async () => await fetchNotifications()
  });
};
