import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { fetchNotifications, fetchWorkspaceNotifications, getUnreadAmount } from '@/services/notiServices';

export const useFetchNotifications = () => {
  return useInfiniteQuery({
    queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS],
    queryFn: async ({ pageParam }) => await fetchNotifications(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => (lastPage.length < 20 ? null : lastPageParam + 1),
    select: (data) => data.pages.flat()
  });
};
export const useFetchWorkspaceNotifications = (wksp_id: string) => {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
    queryFn: async ({ pageParam }) => await fetchWorkspaceNotifications(pageParam, wksp_id),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => (lastPage?.length < 20 ? null : lastPageParam + 1),
    select: (data) => data.pages.flat()
  });
  return {
    notifications: data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
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
