import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { User, UserForm } from '@/libs/types/userType';
import { uploadImage, updateUser } from '@/services/userServices';
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
      await queryClient.invalidateQueries({ queryKey: [MY_INFO_KEY] });
      await queryClient.invalidateQueries({ queryKey: ['user', variable.user_id] });
    }
  });

  return {
    updateUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
