import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { markSeenNotification } from '@/services/notiServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMarkSeenNotification = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (noti_id: string) => await markSeenNotification(noti_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] });
      await queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS] });
    }
  });
  return {
    markSeen: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
