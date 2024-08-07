import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { Noti } from '@/libs/types/notiType';
import { markSeenNotification, removeNotification, removeNotificationById } from '@/services/notiServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReceiveNotifications = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (notification: Noti) => await Promise.resolve(notification),
    onSuccess: (notification) => {
      const newNotification = { ...notification, is_read: false };

      // queryClient.setQueryData<InfiniteData<Noti[], number>>([NotiQueryEnum.GLOBAL_NOTIFICATIONS], (old) => {
      //   if (!old) return;

      //   return {
      //     pageParams: old.pageParams,
      //     pages: [[newNotification, ...old.pages[0]], ...old.pages.slice(1)]
      //   };
      // });
      if (newNotification.workspace) {
        //   queryClient.setQueryData<InfiniteData<Noti[], number>>(
        //     [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, newNotification.workspace.wksp_id],
        //     (old) => {
        //       if (!old) return;

        //       return {
        //         pageParams: old.pageParams,
        //         pages: [[newNotification, ...old.pages[0]], ...old.pages.slice(1)]
        //       };
        //     }
        //   );

        queryClient.invalidateQueries({
          queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, newNotification.workspace.wksp_id]
        });
      }
      queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION] });
      queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] });
    }
  });

  return {
    receiveNotification: mutate,
    isPending,
    isError
  };
};

export const useMarkSeenNotification = (wksp_id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (noti_id: string) => await markSeenNotification(noti_id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] }),
        queryClient.invalidateQueries({
          queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
          exact: true
        }),
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

export const useRemoveNotificationById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: (noti_id: string) => removeNotificationById(noti_id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [NotiQueryEnum.ADMIN_NOTIFICATION]
        }),
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] }),
        queryClient.invalidateQueries({
          queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS]
        }),
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION] })
      ]);
    },
    onError: (_error) => {}
  });

  return {
    removeNotification: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};
export const useRemoveNotification = (wksp_id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (noti_id: string) => await removeNotification(wksp_id, noti_id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] }),
        queryClient.invalidateQueries({
          queryKey: [NotiQueryEnum.WORKSPACE_NOTIFICATIONS, wksp_id],
          exact: true
        }),
        queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.UNREAD_AMOUNT_NOTIFICATION] })
      ]);
    }
  });
  return {
    remove: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
