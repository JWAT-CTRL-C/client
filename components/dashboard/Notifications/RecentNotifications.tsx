import { SimpleGrid } from '@mantine/core';
import { NotificationItem } from './NotificationItem';
import { useFetchNotifications } from '@/libs/hooks/queries/notiQueries';

export interface IRecentNotificationsProps {}

export default function RecentNotifications({}: IRecentNotificationsProps) {
  const { data: notifications } = useFetchNotifications();

  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
        verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
        {notifications
          ?.slice(0, 6)
          ?.map((noti) => <NotificationItem key={noti.noti_id} notification={noti} />)}
      </SimpleGrid>
    </div>
  );
}
