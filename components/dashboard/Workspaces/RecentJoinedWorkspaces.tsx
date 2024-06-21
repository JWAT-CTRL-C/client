import _ from 'lodash';

import WorkspaceCard from '@/components/workspaces/workspaceCard';
import { useFetchRecentWorkspaces } from '@/libs/hooks/queries/workspaceQueries';
import { Flex, Skeleton } from '@mantine/core';

export interface IRecentJoinedWorkspacesProps {}

export default function RecentJoinedWorkspaces({}: IRecentJoinedWorkspacesProps) {
  const { workspaces, isPending } = useFetchRecentWorkspaces();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <Flex
        mih={100}
        gap='lg'
        align='flex-start'
        direction='row'
        wrap='wrap'
        rowGap='md'
        className='justify-center md:justify-start'>
        {isPending || _.isNil(workspaces) ? (
          <Skeleton />
        ) : (
          workspaces.map((data, index) => <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />)
        )}
      </Flex>
    </div>
  );
}
