import _ from 'lodash';

import WorkspaceCard from '@/components/workspaces/workspaceCard';
import { useFetchRecentWorkspaces } from '@/libs/hooks/queries/workspaceQueries';
import { Skeleton } from '@mantine/core';

export interface IRecentJoinedWorkspacesProps {}

export default function RecentJoinedWorkspaces({}: IRecentJoinedWorkspacesProps) {
  const { workspaces, isPending } = useFetchRecentWorkspaces();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4'>
        {isPending || _.isNil(workspaces) ? (
          <Skeleton />
        ) : (
          workspaces.map((data, index) => <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />)
        )}
      </div>
    </div>
  );
}
