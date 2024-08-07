import { GET_ALL_USERS_FOR_ADMIN_KEY, MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { User, UserForm, UserFormForAdmin } from '@/libs/types/userType';
import {
  uploadImage,
  updateUser,
  removeUser,
  restoreUser,
  createUser,
  resetPassword,
  changePassword
} from '@/services/userServices';
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
    uploadImage: mutation.mutate,
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
    updateUser: mutation.mutate,
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
    removeUser: mutation.mutate,
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
    restoreUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, Omit<UserFormForAdmin, 'user_id' | 'pass'>>({
    mutationFn: createUser,
    onSuccess: async (_data) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] });
    }
  });

  return {
    createUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, number>({
    mutationFn: async (user_id: number) => {
      await resetPassword(user_id);
    },
    onSuccess: async (_data) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY] });
    }
  });

  return {
    resetPassword: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, { user_id: number; oldPass: string; newPass: string }>({
    mutationFn: async (data) => {
      await changePassword(data);
    },
    onSuccess: async (_data) => {
      await queryClient.invalidateQueries({ queryKey: [MY_INFO_KEY] });
    }
  });

  return {
    changePassword: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
