import { getUnreadAmount } from '@/services/notiServices';
import { QueryClient } from '@tanstack/react-query';
import { NotiQueryEnum } from '../constants/queryKeys/noti';

export const prefetchUnreadAmount = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION],
    queryFn: async () => await getUnreadAmount()
  });
