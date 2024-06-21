import { QueryClient } from '@tanstack/react-query';
import { getRecentWorkspaces } from '@/services/workspaceServices';
import { GET_RECENT_WORKSPACES_KEY } from '../constants/queryKeys/workspace';

export const prefetchRecentWorkspaces = async (queryClient: QueryClient) =>
  await queryClient.prefetchQuery({
    queryKey: [GET_RECENT_WORKSPACES_KEY],
    queryFn: async () => await getRecentWorkspaces()
  });
