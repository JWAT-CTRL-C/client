import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { getUserAuth } from '@/libs/utils';
import { login } from '@/services/authenServices';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useLogin = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: () => {
      setErrorMessage(null);
      router.push('/blogs');
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage
  };
};
