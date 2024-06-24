import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { ScrollArea } from '@mantine/core';
// import NotificationListItem from './notificationListItem';
import { lazy, Suspense } from 'react';
import ListItemSkeleton from '@/components/skeletons/listItemSkeleton';

export default function NotificationList({
  notifications
}: {
  notifications: SPECIFIC_WORKSPACE_RESPONSE['notifications'];
}) {
  const NotificationListItem = lazy(() => import('./notificationListItem'));
  if (notifications.length === 0) return <div className='bg-slate-100 p-5'> No notifications</div>;
  return (
    <div className='border-spacing-5 border bg-slate-50'>
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
