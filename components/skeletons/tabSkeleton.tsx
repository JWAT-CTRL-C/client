import { Skeleton } from '@mantine/core';

export default function TabSkeleton() {
  return (
    <div className='max-h-[90vh] px-[8%]'>
      <Skeleton width={500} />
    </div>
  );
}
