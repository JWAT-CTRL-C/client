import { Noti } from '@/libs/types/notiType';
import { Text, Avatar, Group, TypographyStylesProvider, Paper } from '@mantine/core';

interface INotificationItemProps {
  notification: Noti;
}

export function NotificationItem({ notification }: INotificationItemProps) {
  return (
    <Paper withBorder radius='md' className='p-4'>
      <Group>
        <Avatar
          src={notification.user.avatar || 'https://images.unsplash.com/photo-1612838320302-3b3b7f0b3b3d'}
          alt={notification.user.fuln}
          radius='xl'
        />
        <div>
          <Text fz='sm'>{notification.user.fuln}</Text>
          <Text fz='xs' c='dimmed'>
            {new Date(notification.crd_at).toDateString()}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className='pl-14 pt-4'>
        <Text fz='h6' className='!mb-2'>
          {notification.noti_tle}
        </Text>
        <Text fz='sm'>{notification.noti_cont}</Text>
      </TypographyStylesProvider>
    </Paper>
  );
}
