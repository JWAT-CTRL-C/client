import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { login } from '@/services/authenServices';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
