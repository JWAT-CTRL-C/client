import { SimpleGrid } from '@mantine/core';
import WorkspaceCard from './workspaceCard';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import _ from 'lodash';

export default function WorkspaceList() {
  const { workspaces } = useFetchWorkspacesByUser();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
        verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
        {!_.isEmpty(workspaces) &&
          (workspaces ?? []).map((data, index) => {
            return <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />;
          })}
      </SimpleGrid>
    </div>
  );
}
