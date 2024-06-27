import * as React from 'react';

import ShowContent from '@/components/EditorContent';
import ModalContent from '@/components/Notifications/ModalContent';
import { Noti } from '@/libs/types/notiType';
import { Badge, Indicator, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export interface INotificationItemProps {
  notification: Noti;
}

export default function NotificationItem({ notification }: INotificationItemProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <div className='flex items-center gap-4' onClick={toggle}>
        <Indicator color='blue' disabled={notification.is_read} style={{ width: rem(12) }} />
        <div className='w-full'>
          <div className='space-x-2 text-sm'>
            <span className='truncate font-semibold'>{notification.noti_tle}</span>
            <Badge color={notification.workspace ? 'green.6' : 'blue'} variant='filled' size='xs'>
              {notification.workspace ? notification.workspace.wksp_name : 'Global'}
            </Badge>
          </div>
          <ShowContent className='line-clamp-2' content={notification.noti_cont} />
        </div>
      </div>

      <ModalContent notification={notification} opened={opened} handleClose={toggle} />
    </>
  );
}
