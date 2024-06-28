import { getAllUsers } from '@/services/userServices';
import {
  getRecentWorkspaces,
  getSpecificWorkspace,
  getWorkspaceMembers,
  getWorkspacesByUser,
  getWorkspacesForMasterAdmin
} from '@/services/workspaceServices';
import { QueryClient } from '@tanstack/react-query';

import { GET_ALL_USERS_KEY } from '../constants/queryKeys/user';
import {
  GET_ALL_WORKSPACES_BY_USER_KEY,
  GET_MASTER_ADMIN_WORKSPACES_KEY, GET_RECENT_WORKSPACES_KEY,
  GET_SPECIFIC_WORKSPACE_KEY,
  GET_WORKSPACE_MEMBERS_KEY
} from '../constants/queryKeys/workspace';

export const prefetchRecentWorkspaces = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [GET_RECENT_WORKSPACES_KEY],
    queryFn: async () => await getRecentWorkspaces()
  });
export const preFetchMyWorkspace = async (queryClient: QueryClient) => {
  return await queryClient.prefetchQuery({
    queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY],
    queryFn: async () => await getWorkspacesByUser()
  });
};
export const fetchSpecificWorkspace = async (queryClient: QueryClient, wksp_id: string) => {
  return await queryClient
    .fetchQuery({
      queryKey: [GET_SPECIFIC_WORKSPACE_KEY + wksp_id],
      queryFn: async () => await getSpecificWorkspace(wksp_id)
    })
    .then(() => true)
    .catch(() => false);
};
export const preFetchAllUser = async (queryClient: QueryClient) => {
  return queryClient.prefetchQuery({
    queryKey: [GET_ALL_USERS_KEY],
    queryFn: async () => await getAllUsers()
  });
};
export const preFetchAllWorkspaceMembers = async (queryClient: QueryClient, wksp_id: string) => {
  return queryClient.prefetchQuery({
    queryKey: [GET_WORKSPACE_MEMBERS_KEY + wksp_id],
    queryFn: async () => await getWorkspaceMembers(wksp_id)
  });
};


export const preFetchAllWorkspaceMasterAdmin = async (queryClient: QueryClient,) => {
  return queryClient.prefetchQuery({
    queryKey: [GET_MASTER_ADMIN_WORKSPACES_KEY , 1],
    queryFn: async () => await getWorkspacesForMasterAdmin(1)
  });
};