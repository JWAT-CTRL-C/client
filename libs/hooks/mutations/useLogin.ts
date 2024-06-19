import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { setUserAuth } from '@/libs/utils';
import { login } from '@/services/authenServices';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setUserAuth(data);
    }
  });

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
