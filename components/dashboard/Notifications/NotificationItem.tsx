import { Noti } from '@/libs/types/notiType';
import { Text, Avatar, Group, TypographyStylesProvider, Paper } from '@mantine/core';
import colors from '@/assets/json/color_background_theme.json';
import _ from 'lodash';

interface INotificationItemProps {
  notification: Noti;
}

export function NotificationItem({ notification }: INotificationItemProps) {
  const avatarSrc = _.isEmpty(notification.user)
    ? 'https://placehold.co/50x50/4191FF/white?text=Sys'
    : notification.user?.avatar ??
      `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${notification.user.fuln?.substring(0, 1)}`;

  return (
    <Paper withBorder radius='md' className='p-4'>
      <Group>
        <Avatar src={avatarSrc} alt={notification.user?.fuln ?? 'System'} radius='xl' />
        <div>
          <Text fz='sm'>{notification.user?.fuln ?? 'System'}</Text>
          <Text fz='xs' c='dimmed'>
            {new Date(notification.crd_at).toDateString()}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className='pl-14 pt-4'>
        <Text fz='h6' className='!mb-2'>
          {notification.noti_tle}
        </Text>
        <Text fz='sm'>{notification.noti_cont + ' ' + notification.workspace.wksp_name}</Text>
      </TypographyStylesProvider>
    </Paper>
  );
}
