import { useQuery } from '@tanstack/react-query';
import { fetchUserById, getAllUsers, getAllUsersForAdmin } from '@/services/userServices';
import { GET_ALL_USERS_FOR_ADMIN_KEY, GET_ALL_USERS_KEY, MY_INFO_KEY } from '@/libs/constants/queryKeys/user';

export const useMyInfo = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [MY_INFO_KEY],
    queryFn: async () => await fetchUserById('me')
  });

  return {
    user: data!,
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
    user: data!,
    isError,
    isFetching,
    isPending
  };
};
export const useGetAllUsers = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_ALL_USERS_KEY],
    queryFn: async () => await getAllUsers()
  });

  return {
    users: data!,
    isError,
    isFetching,
    userPending: isPending
  };
};

export const useGetAllUsersForAdmin = (page: number) => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_ALL_USERS_FOR_ADMIN_KEY, page],
    queryFn: async () => await getAllUsersForAdmin(page)
  });

  return {
    users: data!,
    isError,
    isFetching,
    isPending
  };
};
