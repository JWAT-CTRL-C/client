import _ from 'lodash';

import WorkspaceCard from '@/components/workspaces/workspaceCard';
import { useFetchRecentWorkspaces } from '@/libs/hooks/queries/workspaceQueries';
import { SimpleGrid, Skeleton } from '@mantine/core';

export interface IRecentJoinedWorkspacesProps {}

export default function RecentJoinedWorkspaces({}: IRecentJoinedWorkspacesProps) {
  const { workspaces, isPending } = useFetchRecentWorkspaces();

  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
        verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
        {isPending || _.isNil(workspaces) ? (
          <Skeleton />
        ) : (
          workspaces.map((data, index) => <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />)
        )}
      </SimpleGrid>
    </div>
  );
}
