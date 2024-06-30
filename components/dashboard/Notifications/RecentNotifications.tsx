import { Flex, SimpleGrid } from '@mantine/core';
import { NotificationItem } from './NotificationItem';
import { useFetchNotifications } from '@/libs/hooks/queries/notiQueries';
import RecentNotificationSkeleton from '@/components/skeletons/recentNotificationSkeleton';
import _ from 'lodash';
import NoData from '@/components/shared/EmptyData';

export interface IRecentNotificationsProps {}

export default function RecentNotifications({}: IRecentNotificationsProps) {
  const { data: notifications, isPending } = useFetchNotifications();

  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      {isPending ? (
        <SimpleGrid
          cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
          spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
          verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <RecentNotificationSkeleton key={index} />
          ))}
        </SimpleGrid>
      ) : !notifications || _.isEmpty(notifications) ? (
        <Flex justify='center' className='my-10'>
          <NoData title='No Recent Notifications' />
        </Flex>
      ) : (
        <SimpleGrid
          cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
          spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
          verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
          {notifications.slice(0, 6).map((notification) => (
            <NotificationItem key={notification.noti_id} notification={notification} />
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}
