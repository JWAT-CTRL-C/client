import {
  GET_ALL_WORKSPACES_BY_USER_KEY,
  GET_MASTER_ADMIN_WORKSPACES_KEY,
  GET_RECENT_WORKSPACES_KEY,
  GET_SPECIFIC_WORKSPACE_KEY,
  GET_WORKSPACE_MEMBERS_KEY
} from '@/libs/constants/queryKeys/workspace';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import {
  addMemberToWorkspace,
  CREATE_WORKSPACE_REQUEST,
  createWorkspace,
  deleteWorkspace,
  franchiseWorkspace,
  removeMemberFromWorkspace,
  UPDATE_WORKSPACE_REQUEST,
  updateWorkspace
} from '@/services/workspaceServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => void,
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (wksp_data: CREATE_WORKSPACE_REQUEST) => await createWorkspace(wksp_data),
    onSuccess: (data) => {
      handleOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_MASTER_ADMIN_WORKSPACES_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_RECENT_WORKSPACES_KEY] });
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    createWorkspace: mutate,
    isPending,
    isSuccess
  };
};

export const useUpdateWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => { wksp_id: string },
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (wksp_data: UPDATE_WORKSPACE_REQUEST) => await updateWorkspace(wksp_data),
    onSuccess: (data) => {
      const { wksp_id } = handleOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [GET_SPECIFIC_WORKSPACE_KEY + wksp_id] });
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    updateWorkspace: mutate,
    isPending,
    isSuccess
  };
};
export const useDeleteWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => void,
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (wksp_id: string) => await deleteWorkspace(wksp_id),
    onSuccess: async (data) => {
      handleOnSuccess(data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY] }),
        queryClient.invalidateQueries({ queryKey: [GET_MASTER_ADMIN_WORKSPACES_KEY] })
      ]);
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    deleteWorkspace: mutate,
    isPending,
    isSuccess
  };
};
export const useAddMemberToWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => { wksp_id: string },
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ wksp_id, user_id }: { wksp_id: string; user_id: number }) =>
      await addMemberToWorkspace(wksp_id, user_id),
    onSuccess: (data) => {
      const { wksp_id } = handleOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [GET_WORKSPACE_MEMBERS_KEY + wksp_id] });
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    addMember: mutate,
    isPending,
    isSuccess
  };
};
export const useRemoveMemberFromWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => { wksp_id: string },
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ wksp_id, user_id }: { wksp_id: string; user_id: number }) =>
      await removeMemberFromWorkspace(wksp_id, user_id),
    onSuccess: (data) => {
      const { wksp_id } = handleOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [GET_WORKSPACE_MEMBERS_KEY + wksp_id] });
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    removeMember: mutate,
    isPending,
    isSuccess
  };
};
export const useFranchiseWorkspace = (
  handleOnSuccess: (data: GENERAL_RESPONSE_TYPE) => { wksp_id: string },
  handleOnError: (error: Error | AxiosError) => void
) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ wksp_id, user_id }: { wksp_id: string; user_id: number }) =>
      await franchiseWorkspace(wksp_id, user_id),
    onSuccess: (data) => {
      const { wksp_id } = handleOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [GET_SPECIFIC_WORKSPACE_KEY + wksp_id] });
      queryClient.invalidateQueries({ queryKey: [GET_WORKSPACE_MEMBERS_KEY + wksp_id] });
    },
    onError: (error) => {
      handleOnError(error);
    }
  });
  return {
    franchise: mutate,
    isPending,
    isSuccess
  };
};
