import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import _ from 'lodash';
import WorkspaceCard from './workspaceCard';

export default function WorkspaceList() {
  const { workspaces } = useFetchWorkspacesByUser();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:w-[90%] lg:grid-cols-3'>
        {!_.isEmpty(workspaces) &&
          (workspaces ?? []).map((data, index) => {
            return <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />;
          })}
      </div>
    </div>
  );
}
