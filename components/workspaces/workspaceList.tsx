import { Flex, SimpleGrid } from '@mantine/core';
import WorkspaceCard from './workspaceCard';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import _ from 'lodash';

export default function WorkspaceList() {
  const { workspaces } = useFetchWorkspacesByUser();

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
        {!_.isEmpty(workspaces) &&
          (workspaces ?? []).map((data, index) => {
            return <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />;
          })}
      </Flex>
    </div>
  );
}
