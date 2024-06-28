import _ from 'lodash';

import WorkspaceCard from '@/components/workspaces/workspaceCard';
import { useFetchRecentWorkspaces } from '@/libs/hooks/queries/workspaceQueries';
import { Flex } from '@mantine/core';
import WorkspaceCardSkeleton from '@/components/skeletons/workspaceCardSkeleton';
import NoData from '@/components/shared/EmptyData';

export interface IRecentJoinedWorkspacesProps {}

export default function RecentJoinedWorkspaces({}: IRecentJoinedWorkspacesProps) {
  const { workspaces, isPending } = useFetchRecentWorkspaces();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      {isPending ? (
        <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <WorkspaceCardSkeleton key={index} />
          ))}
        </div>
      ) : _.isEmpty(workspaces) || _.isNil(workspaces) ? (
        <Flex justify={'center'} className='my-10'>
          <NoData title='No Recent Blogs' />
        </Flex>
      ) : (
        <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 xl:grid-cols-3'>
          {workspaces.map((data, index) => (
            <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />
          ))}
        </div>
      )}
    </div>
  );
}
