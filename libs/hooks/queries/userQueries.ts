import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/services/userServices';

export const useMyInfo = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: ['myInfo'],
    queryFn: () => fetchUserById('me')
  });

  return {
    user: data,
    isError,
    isFetching,
    isPending
  };
};

export const useUserInfo = (user_id: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: ['user', user_id],
    queryFn: () => fetchUserById(user_id)
  });

  return {
    user: data,
    isError,
    isFetching,
    isPending
  };
};
