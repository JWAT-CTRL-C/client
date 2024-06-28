import { Divider, Skeleton } from '@mantine/core';

export default function RecentNotificationSkeleton() {
  return (
    <div className='mt-4 w-full rounded-xl bg-muted p-5 pb-7 shadow-md'>
      <div className='flex-start mb-3 gap-4'>
        <Skeleton circle height={50} width={50} />

        <div className='space-y-2 text-xs text-slate-500'>
          <Skeleton height={20} width={100} />
          <Skeleton radius='lg' height={20} width={70} />
        </div>
      </div>
      <Divider size={'xs'} />
      <div className='mt-2 grid gap-2 pl-[8%]'>
        <Skeleton height={20} width={200} />
        <Skeleton height={20} width={100} />
      </div>
    </div>
  );
}
