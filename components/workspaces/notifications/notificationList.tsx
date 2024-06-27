import { Loader, ScrollArea } from '@mantine/core';
import NotificationListItem from './notificationListItem';
import { lazy, Suspense, useEffect } from 'react';
import ListItemSkeleton from '@/components/skeletons/listItemSkeleton';
import NoData from '@/components/shared/EmptyData';
import { Noti } from '@/libs/types/notiType';
import { useFetchWorkspaceNotifications } from '@/libs/hooks/queries/notiQueries';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useInView } from 'react-intersection-observer';

export default function NotificationList() {
  const router = useRouter();

  const { notifications, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchWorkspaceNotifications(router.query.id as string);

  if (isPending) return <></>;

  if (_.isEmpty(notifications) || _.isNil(notifications)) return <NoData title='No notifications found' />;
  const [ref, inView] = useInView({ threshold: 0 });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);

  return (
    <div className=''>
      <ScrollArea.Autosize
        mah={520}
        scrollbarSize={4}
        scrollHideDelay={500}
        className='rounded-lg bg-neutral-50 py-2 dark:bg-neutral-800'>
        <div className='grid w-full grid-cols-2 gap-3 px-4 lg:grid-cols-3'>
          {notifications.map((notification) => (
            <NotificationListItem item={notification} key={notification.noti_id} />
          ))}
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
