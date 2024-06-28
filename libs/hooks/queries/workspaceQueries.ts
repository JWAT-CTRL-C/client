import {
  CREATE_WORKSPACE_REQUEST,
  getSpecificWorkspace,
  getWorkspaceMembers,
  getWorkspacesByUser,
  getWorkspacesForMasterAdmin,
  SPECIFIC_WORKSPACE_RESPONSE,
  WORKSPACE_MEMBER
} from '@/services/workspaceServices';
import {
  GET_ALL_WORKSPACES_BY_USER_KEY,
  GET_MASTER_ADMIN_WORKSPACES_KEY,
  GET_RECENT_WORKSPACES_KEY,
  GET_SPECIFIC_WORKSPACE_KEY,
  GET_WORKSPACE_MEMBERS_KEY
} from '@/libs/constants/queryKeys/workspace';
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
    queryKey: [GET_SPECIFIC_WORKSPACE_KEY + wksp_id],
    queryFn: async () => await getSpecificWorkspace(wksp_id)
  });

  return {
    workspace: data,
    isError,
    isFetching,
    isPending
  };
};

export const useFetchRecentWorkspaces = () => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_RECENT_WORKSPACES_KEY],
    queryFn: async () => await getWorkspacesByUser()
  });

  return {
    workspaces: data,
    isError,
    isFetching,
    isPending
  };
};

export const useGetWorkspaceMember = (wksp: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    enabled: !!wksp,
    initialData: {} as WORKSPACE_MEMBER,
    queryKey: [GET_WORKSPACE_MEMBERS_KEY + wksp],
    queryFn: async () => await getWorkspaceMembers(wksp)
  });

  return {
    members: data,
    isError,
    isFetching,
    isPending
  };
};

export const useGetWorkspaceForMasterAdmin = (page: number) => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_MASTER_ADMIN_WORKSPACES_KEY, page],
    queryFn: async () => await getWorkspacesForMasterAdmin(page)
  });

  return {
    workspaces: data,
    isError,
    isFetching,
    isPending
  };
};
