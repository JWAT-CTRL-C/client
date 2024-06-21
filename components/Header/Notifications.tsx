import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { Indicator, Menu, Tooltip } from '@mantine/core';

import { useState } from 'react';
import { FaBell } from 'react-icons/fa';

const Notifications = () => {
  const [opened, setOpened] = useState(false);

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
        <Indicator inline label='2' size={16} className='cursor-pointer'>
          <Tooltip label='Notifications'>
            <FaBell className='size-6 max-md:size-5' />
          </Tooltip>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Notifications</Menu.Label>
        <Menu.Item>Notification</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Notifications;
