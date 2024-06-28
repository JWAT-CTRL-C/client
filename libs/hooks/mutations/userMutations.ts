import { GET_ALL_USERS_FOR_ADMIN_KEY, MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { User, UserForm, UserFormForAdmin } from '@/libs/types/userType';
import { uploadImage, updateUser, removeUser, restoreUser, createUser } from '@/services/userServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MY_INFO_KEY] });
    }
  });

  return {
    uploadImage: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    imageUrl: mutation.data
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<User, Error, UserForm>({
    mutationFn: updateUser,
    onSuccess: async (_data, variable) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [MY_INFO_KEY] }),
        queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] }),

        queryClient.invalidateQueries({ queryKey: ['user', variable.user_id] })
      ]);
    }
  });

  return {
    updateUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, number>({
    mutationFn: removeUser,
    onSuccess: async (_data, variable) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] });
    }
  });

  return {
    removeUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, number>({
    mutationFn: restoreUser,
    onSuccess: async (_data, variable) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] });
    }
  });

  return {
    restoreUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, Omit<UserFormForAdmin, 'user_id'>>({
    mutationFn: createUser,
    onSuccess: async (_data, variable) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] });
    }
  });

  return {
    createUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
