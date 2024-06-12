
import { workspacesType } from '@/libs/types/workspacesType';
import { fetchWorkspacesForCurrentUser } from '@/services/workspaceServices';
import { useQuery } from '@tanstack/react-query';

export const useFetchWorkspacesCurrentUser = () => {
  return useQuery<void, Error, workspacesType[]>({
    queryKey: ['blogs-current-user'],
    queryFn: async () => await fetchWorkspacesForCurrentUser()
  });
};
