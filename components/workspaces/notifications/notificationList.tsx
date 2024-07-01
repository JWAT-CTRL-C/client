import { Checkbox, Loader, ScrollArea } from '@mantine/core';
import NotificationListItem from './notificationListItem';
import NoData from '@/components/shared/EmptyData';
import { useFetchWorkspaceNotifications } from '@/libs/hooks/queries/notiQueries';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useInView } from 'react-intersection-observer';
import { Suspense, useEffect, useState } from 'react';
import RecentNotificationSkeleton from '@/components/skeletons/recentNotificationSkeleton';

export default function NotificationList() {
  const router = useRouter();
  const [ref, inView] = useInView({ threshold: 0 });
  const [withoutSys, setWithoutSys] = useState(false);
  const { notifications, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchWorkspaceNotifications(router.query.id as string);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);

  const showListNoti = notifications?.filter((noti) => (withoutSys && !noti?.user ? null : noti));

  if (isPending)
    return (
      <div className='grid w-full grid-cols-2 gap-3 px-4 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <RecentNotificationSkeleton key={index} />
        ))}
      </div>
    );
  if (_.isEmpty(notifications) || _.isNil(notifications)) return <NoData title='No notifications found' />;

  return (
    <div className=''>
      <ScrollArea.Autosize
        mah={520}
        scrollbarSize={4}
        scrollHideDelay={500}
        className='rounded-lg bg-neutral-50 py-2 dark:bg-neutral-800'>
        <div className='flex-end w-full gap-3 pb-3 pr-5'>
          <Checkbox checked={withoutSys} onChange={() => setWithoutSys((prev) => !prev)} />
          <label>Without system notifications</label>
        </div>
        <div className='grid w-full grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3'>
          {showListNoti.length > 0
            ? showListNoti.map((notification) => (
                <NotificationListItem item={notification} key={notification.noti_id} />
              ))
            : !isFetchingNextPage && (
                <div className='flex-center w-full sm:col-span-2 lg:col-span-3'>
                  <NoData title='No notifications found' />
                </div>
              )}
        </div>
        {hasNextPage && (
          <div ref={ref} className='flex-center my-3 w-full p-3'>
            {isFetchingNextPage && <Loader size={20} />}
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
}
