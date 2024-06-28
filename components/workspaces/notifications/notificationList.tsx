import { ScrollArea } from '@mantine/core';
import NotificationListItem from './notificationListItem';
import NotificationSkeleton from '@/components/skeletons/notificationSkeleton';
import NoData from '@/components/shared/EmptyData';
import { useFetchWorkspaceNotifications } from '@/libs/hooks/queries/notiQueries';
import { useRouter } from 'next/router';
import _ from 'lodash';

export default function NotificationList() {
  const router = useRouter();

  const { notifications, isPending } = useFetchWorkspaceNotifications(router.query.id as string);

  if (isPending) return <NotificationSkeleton />;

  if (_.isEmpty(notifications) || _.isNil(notifications)) return <NoData title='No notifications found' />;

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
      </ScrollArea.Autosize>
    </div>
  );
}
