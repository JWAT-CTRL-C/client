import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { Noti } from '@/libs/types/notiType';
import { markSeenNotification } from '@/services/notiServices';
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';

export const useReceiveNotifications = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (notification: Noti) => await Promise.resolve(notification),
    onSuccess: (notification) => {
      const newNotification = { ...notification, is_read: false };

      queryClient.setQueryData<InfiniteData<Noti[], number>>([NotiQueryEnum.GLOBAL_NOTIFICATIONS], (old) => {
        if (!old) return;

        return {
          pageParams: old.pageParams,
          pages: [[newNotification, ...old.pages[0]], ...old.pages.slice(1)]
        };
      });
      if (newNotification.workspace) {
        queryClient.setQueryData(
          [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, newNotification.workspace.wksp_id],
          (old: Noti[]) => {
            if (!old) return;

            return [newNotification, ...old];
          }
        );

        // queryClient.invalidateQueries({
        //   queryKey: [GET_SPECIFIC_WORKSPACE_KEY + newNotification.workspace.wksp_id]
        // });
      }
      queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION] });
      // queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] });
    }
  });

  return {
    receiveNotification: mutateAsync,
    isPending,
    isError
  };
};

export const useMarkSeenNotification = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (noti_id: string) => await markSeenNotification(noti_id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] }),
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS] }),
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION] })
      ]);
    }
  });
  return {
    markSeen: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
