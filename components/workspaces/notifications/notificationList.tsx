import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { ScrollArea } from '@mantine/core';
// import NotificationListItem from './notificationListItem';
import { lazy, Suspense } from 'react';
import ListItemSkeleton from '@/components/skeletons/listItemSkeleton';
import NoData from '@/components/shared/EmptyData';

export default function NotificationList({
  notifications
}: {
  notifications: SPECIFIC_WORKSPACE_RESPONSE['notifications'];
}) {
  const NotificationListItem = lazy(() => import('./notificationListItem'));
  if (notifications.length === 0) return <NoData title='No notifications found' />;
  return (
    <div className=''>
      <ScrollArea h={520} scrollbarSize={4} scrollHideDelay={500}>
        {notifications.map((notification) => (
          <Suspense fallback={<ListItemSkeleton />} key={notification.noti_id}>
            <NotificationListItem item={notification} key={notification.noti_id} />
          </Suspense>
        ))}
      </ScrollArea>
    </div>
  );
}
