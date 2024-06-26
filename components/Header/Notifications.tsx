import { useFetchNotifications } from '@/libs/hooks/queries/notiQueries';
import { Badge, Indicator, Menu, ScrollArea, Tooltip } from '@mantine/core';

import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import ShowContent from '../EditorContent';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  const [opened, setOpened] = useState(false);

  const { data: notifications } = useFetchNotifications();

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnClickOutside
      closeOnItemClick
      shadow='md'
      offset={10}
      keepMounted
      withArrow
      width={400}
      position='bottom'
      transitionProps={{ transition: 'fade-down', duration: 150 }}>
      <Menu.Target>
        <Indicator inline label={notifications?.length ?? 0} size={16} className='cursor-pointer'>
          <Tooltip label='Notifications' openDelay={500}>
            <div>
              <FaBell className='size-6 max-md:size-5' />
            </div>
          </Tooltip>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown className='py-4'>
        <Menu.Label>Notifications</Menu.Label>
        <ScrollArea.Autosize mah={350} scrollHideDelay={500} scrollbarSize={3}>
          {notifications?.map((notification) => (
            <Menu.Item key={notification.noti_id} className='flex items-center py-3 pl-7'>
              <NotificationItem notification={notification} />
            </Menu.Item>
          ))}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Notifications;
