import { GET_ALL_RESOURCES_KEY, GET_SPECIFIC_RESOURCE_KEY } from '@/libs/constants/queryKeys/resource';
import { getAllResources, getSpecificResource } from '@/services/resourceServices';
import { useQuery } from '@tanstack/react-query';

export const useGetAllResourcesByWorkspace = (wksp_id: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    enabled: !!wksp_id,
    queryKey: [GET_ALL_RESOURCES_KEY + wksp_id],
    queryFn: async () => await getAllResources(wksp_id)
  });

  return {
    resources: data ?? [],
    isError,
    isFetching,
    isPending
  };
};
export const useGetSpecificResource = (wksp_id: string, resrc_id: string) => {
  const { data, isError, isFetching, isPending } = useQuery({
    queryKey: [GET_SPECIFIC_RESOURCE_KEY + resrc_id],
    queryFn: async () => await getSpecificResource(wksp_id, resrc_id)
  });
  return {
    resource: data ?? [],
    isError,
    isFetching,
    isPending
  };
};
