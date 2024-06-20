import { SimpleGrid } from '@mantine/core';
import { NotificationItem } from './NotificationItem';

export interface IRecentNotificationsProps {}

export default function RecentNotifications({}: IRecentNotificationsProps) {
  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ xs: 'xl', sm: 'xl', md: 'xl' }}
        verticalSpacing={{ xs: 'md', sm: 'md', md: 'lg' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <NotificationItem key={index} />
        ))}
      </SimpleGrid>
    </div>
  );
}
