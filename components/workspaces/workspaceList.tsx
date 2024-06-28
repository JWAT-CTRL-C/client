import _ from 'lodash';

import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import { Flex } from '@mantine/core';

import NoData from '../shared/EmptyData';
import WorkspaceCardSkeleton from '../skeletons/workspaceCardSkeleton';
import WorkspaceCard from './workspaceCard';

export default function WorkspaceList() {
  const { workspaces, isPending } = useFetchWorkspacesByUser();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      {isPending ? (
        <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:w-[90%]'>
          {Array.from({ length: 6 }).map((_, index) => (
            <WorkspaceCardSkeleton key={index} />
          ))}
        </div>
      ) : _.isEmpty(workspaces) || !workspaces ? (
        <Flex justify={'center'} className='my-10'>
          <NoData title='No Workspaces Found' />
        </Flex>
      ) : (
        <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:w-[90%]'>
          {workspaces.map((data, index) => (
            <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />
          ))}
        </div>
      )}
    </div>
  );
}
