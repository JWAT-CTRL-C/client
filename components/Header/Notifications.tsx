import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

import { useFetchNotifications, useFetchUnreadAmount } from '@/libs/hooks/queries/notiQueries';
import { Indicator, Loader, Menu, ScrollArea, Tooltip } from '@mantine/core';

import NotificationItem from './NotificationItem';

const Notifications = () => {
  const [opened, setOpened] = useState(false);

  const { data: notifications, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchNotifications();
  const { unreadAmount } = useFetchUnreadAmount();

  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);

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
        <Indicator inline label={unreadAmount} disabled={!unreadAmount} size={16} className='cursor-pointer'>
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
          {hasNextPage && (
            <div className='flex-center my-3 w-full p-3' ref={ref}>
              {isFetchingNextPage && <Loader size={20} />}
            </div>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Notifications;
