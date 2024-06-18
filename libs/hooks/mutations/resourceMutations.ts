import { GET_ALL_RESOURCES_KEY, GET_SPECIFIC_RESOURCE_KEY } from '@/libs/constants/queryKeys/resource';
import {
  createResource,
  removeResource,
  RESOURCE_REQUEST,
  updateResource
} from '@/services/resourceServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateResource = (hanldeSuccess: () => { wksp_id: string }, hanldeError: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ wksp_id, resource }: { wksp_id: string; resource: RESOURCE_REQUEST }) =>
      await createResource(wksp_id, resource),
    onSuccess: async () => {
      const { wksp_id } = hanldeSuccess();
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_RESOURCES_KEY + wksp_id] });
    },
    onError: hanldeError
  });
  return {
    createResource: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
export const useUpdateResource = (hanldeSuccess: () => { wksp_id: string }, hanldeError?: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      wksp_id,
      resrc_id,
      resource
    }: {
      wksp_id: string;
      resrc_id: string;
      resource: RESOURCE_REQUEST;
    }) => await updateResource(wksp_id, resrc_id, resource),
    onSuccess: async (res) => {
      const { wksp_id } = hanldeSuccess();
      await queryClient.invalidateQueries({ queryKey: [GET_ALL_RESOURCES_KEY + wksp_id] });
    },
    onError: hanldeError
  });
  return {
    updateResource: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
export const useDeleteResource = (hanldeSuccess: () => { wksp_id: string }, hanldeError?: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ wksp_id, resrc_id }: { wksp_id: string; resrc_id: string }) =>
      await removeResource(wksp_id, resrc_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_RESOURCES_KEY + hanldeSuccess().wksp_id]
      });
    },
    onError: hanldeError
  });
  return {
    deleteResource: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
};
