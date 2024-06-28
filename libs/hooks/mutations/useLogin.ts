import { setUserAuth } from '@/libs/utils';
import { login } from '@/services/authenServices';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUserAuth(data);
    }
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
