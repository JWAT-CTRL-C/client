import {
  CREATE_WORKSPACE_REQUEST,
  getSpecificWorkspace,
  getWorkspaceMembers,
  getWorkspacesByUser
} from '@/services/workspaceServices';
import {
  GET_ALL_WORKSPACES_BY_USER_KEY,
  GET_SPECIFIC_WORKSPACE_KEY,
  GET_WORKSPACE_MEMBERS_KEY
} from './../../constants/queryKeys/workspace';
import { useQuery } from '@tanstack/react-query';

export const useFetchWorkspacesByUser = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY],
    queryFn: async () => await getWorkspacesByUser()
  });

  return {
    workspaces: data,
    isError,
    isFetching,
    isPending
  };
};

export const useFetchWorkspaceById = (wksp_id: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    enabled: !!wksp_id,
    queryKey: [GET_SPECIFIC_WORKSPACE_KEY],
    queryFn: async () => await getSpecificWorkspace(wksp_id)
  });

  return {
    workspace: data,
    isError,
    isFetching,
    isPending
  };
};

export const useGetWorkspaceMember = (wksp: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    enabled: !!wksp,
    queryKey: [GET_WORKSPACE_MEMBERS_KEY],
    queryFn: async () => await getWorkspaceMembers(wksp)
  });

  return {
    members: data,
    isError,
    isFetching,
    isPending
  };
};
