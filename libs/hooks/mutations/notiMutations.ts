import { NotiQueryEnum } from '@/libs/constants/queryKeys/noti';
import { GET_SPECIFIC_WORKSPACE_KEY } from '@/libs/constants/queryKeys/workspace';
import { Noti } from '@/libs/types/notiType';
import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReceiveNotifications = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (notification: Noti) => await Promise.resolve(notification),
    onSuccess: (notification) => {
      const newNotification = { ...notification, is_read: false };

      queryClient.setQueryData([NotiQueryEnum.GLOBAL_NOTIFICATIONS], (old: Noti[]) => {
        if (!old) return;

        return [newNotification, ...old];
      });

      if (newNotification.workspace) {
        queryClient.setQueryData(
          [GET_SPECIFIC_WORKSPACE_KEY + newNotification.workspace.wksp_id],
          (old: SPECIFIC_WORKSPACE_RESPONSE) => {
            if (!old) return;

            return {
              ...old,
              notifications: [newNotification, ...old.notifications]
            };
          }
        );

        queryClient.invalidateQueries({
          queryKey: [GET_SPECIFIC_WORKSPACE_KEY + newNotification.workspace.wksp_id]
        });
      }
      queryClient.invalidateQueries({ queryKey: [NotiQueryEnum.GLOBAL_NOTIFICATIONS] });
    }
  });

  return {
    receiveNotification: mutateAsync,
    isPending,
    isError
  };
};
