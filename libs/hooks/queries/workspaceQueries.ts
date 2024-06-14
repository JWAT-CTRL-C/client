import { workspacesType } from '@/libs/types/workspacesType';
import { fetchOneWorkSpace, fetchWorkspacesForCurrentUser } from '@/services/workspaceServices';
import { useQuery } from '@tanstack/react-query';

export const useFetchWorkspacesCurrentUser = () => {
  return useQuery<void, Error, workspacesType[]>({
    queryKey: ['workspaces-current-user'],
    queryFn: async () => await fetchWorkspacesForCurrentUser()
  });
};

export const useFetchWorkspacesCurrentUserById = (wksp_id: string) => {
  return useQuery<void, Error, workspacesType>({
    queryKey: ['workspaces-current-user', wksp_id],
    queryFn: async () => await fetchOneWorkSpace(wksp_id)
  });
};
