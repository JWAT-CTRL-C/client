import { useFetchNotifications } from '@/libs/hooks/queries/notiQueries';
import { Indicator, Menu, Tooltip } from '@mantine/core';

import { useState } from 'react';
import { FaBell } from 'react-icons/fa';

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
      disabled={false}
      offset={10}
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

      <Menu.Dropdown>
        <Menu.Label>Notifications</Menu.Label>
        {notifications?.map((noti) => (
          <Menu.Item key={noti.noti_id} className='flex items-center'>
            <div className='flex items-center gap-4'>
              <Indicator color='blue' />
              <div>
                <div className='text-sm'>{noti.noti_tle}</div>
                <div className='text-xs text-gray-500'>{noti.noti_cont + ' ' + noti.workspace.wksp_name}</div>
              </div>
            </div>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default Notifications;
