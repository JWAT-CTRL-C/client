import { QueryClient } from '@tanstack/react-query';
import { GET_ALL_RESOURCES_KEY, GET_SPECIFIC_RESOURCE_KEY } from '../constants/queryKeys/resource';
import { getAllResources, getSpecificResource } from '@/services/resourceServices';

export const preFetchAllResources = async (queryClient: QueryClient, wksp_id: string) => {
  return queryClient.prefetchQuery({
    queryKey: [GET_ALL_RESOURCES_KEY + wksp_id],
    queryFn: async () => await getAllResources(wksp_id)
  });
};
export const preFetchSpecificResource = async (
  queryClient: QueryClient,
  wksp_id: string,
  resrc_id: string
) => {
  return await queryClient
    .fetchQuery({
      queryKey: [GET_SPECIFIC_RESOURCE_KEY + resrc_id],
      queryFn: async () => await getSpecificResource(wksp_id, resrc_id)
    })
    .then(() => true)
    .catch(() => false);
};
