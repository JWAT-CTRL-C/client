import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import _ from 'lodash';
import WorkspaceCard from './workspaceCard';
import WorkspaceCardSkeleton from '../skeletons/workspaceCardSkeleton';

export default function WorkspaceList() {
  const { workspaces, isPending } = useFetchWorkspacesByUser();

  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <div className='grid min-h-24 w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:w-[90%]'>
        {isPending
          ? Array.from({ length: 6 }).map((_, index) => <WorkspaceCardSkeleton key={index} />)
          : !_.isEmpty(workspaces) &&
            workspaces &&
            workspaces.map((data, index) => {
              return <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />;
            })}
      </div>
    </div>
  );
}
