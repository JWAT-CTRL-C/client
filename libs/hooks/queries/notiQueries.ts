import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { fetchNotifications } from '@/services/notiServices';

export const useFetchNotifications = () => {
  return useInfiniteQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async ({ pageParam }) => await fetchNotifications(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.length < 20 ? undefined : lastPage.length + 1),
    select: (data) => data.pages.flat()
  });
};
