import { useQuery } from '@tanstack/react-query';
import { fetchUserById, getAllUsers, USER_TYPE } from '@/services/userServices';
import { GET_ALL_USERS_KEY, MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { useStore } from '@/providers/StoreProvider';

export const useMyInfo = () => {
  const setRole = useStore((state) => state.setRole);

  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [MY_INFO_KEY],
    queryFn: async () => {
      const user = await fetchUserById('me');

      setRole(user.role);

      return user;
    }
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
    queryFn: async () => await fetchUserById(user_id)
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
