import { Divider, SimpleGrid, Skeleton } from '@mantine/core';
import { NotificationItem } from './NotificationItem';
import { useFetchNotifications } from '@/libs/hooks/queries/notiQueries';
import RecentNotificationSkeleton from '@/components/skeletons/recentNotificationSkeleton';

export interface IRecentNotificationsProps {}

export default function RecentNotifications({}: IRecentNotificationsProps) {
  const { data: notifications, isPending } = useFetchNotifications();

  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
        verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
        {isPending
          ? Array.from({ length: 6 }).map((_, index) => <RecentNotificationSkeleton key={index} />)
          : notifications &&
            notifications
              .slice(0, 6)
              .map((notification) => (
                <NotificationItem key={notification.noti_id} notification={notification} />
              ))}
      </SimpleGrid>
    </div>
  );
}
