import { useQuery } from '@tanstack/react-query';
import { fetchUserById, getAllUsers, USER_TYPE } from '@/services/userServices';
import { GET_ALL_USERS_KEY } from '@/libs/constants/queryKeys/user';

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
export const useGetAllUsers = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    initialData: [] as USER_TYPE[],
    queryKey: [GET_ALL_USERS_KEY],
    queryFn: async () => await getAllUsers()
  });
  return {
    users: data,
    isError,
    isFetching,
    isPending
  };
};
