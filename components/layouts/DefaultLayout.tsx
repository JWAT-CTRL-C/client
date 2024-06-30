import 'highlight.js/styles/default.css';

import { debounce } from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { NotificationItem } from '@/components/dashboard/Notifications/NotificationItem';
import FloatingButton from '@/components/FloatingButton';
import { showNotifyToast } from '@/components/shared/toast';
import ToTopButton from '@/components/ToTopButton';
import { useReceiveNotifications } from '@/libs/hooks/mutations/notiMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { NotificationType } from '@/libs/types';
import { Noti } from '@/libs/types/notiType';
import { useStore } from '@/providers/StoreProvider';
import { AppShell, Burger, Group, LoadingOverlay, rem, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Header from './header';
import Sidebar from './sidebar';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { notificationSocket, setUser, setScrollY } = useStore((store) => store);

  const { user, isPending } = useMyInfo();
  const { receiveNotification } = useReceiveNotifications();

  const viewportRef = useRef<HTMLDivElement>(null);

  // prevent hydration error
  const [loader, setLoader] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setLoader(true);

    if (notificationSocket && user && !isListening) {
      notificationSocket.emit(NotificationType.SETUP_USER, user.user_id);
      for (const workspace of user.workspaces) {
        notificationSocket.emit(NotificationType.SETUP_WORKSPACE, workspace.wksp_id);
      }
      notificationSocket.on(NotificationType.NEW, (notification: Noti) => {
        receiveNotification(notification);
        if (!notification.user || notification.user.user_id !== user.user_id)
          showNotifyToast(<NotificationItem notification={notification} toast />);
      });
      setIsListening(true);
    }

    if (user) {
      setUser(user);
    }

    return () => {
      if (notificationSocket && isListening) {
        notificationSocket.off(NotificationType.NEW);
        setIsListening(false);
      }
    };
  }, [user]);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return !loader ? (
    <></>
  ) : isPending ? (
    <LoadingOverlay visible />
  ) : (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: {
          base: 200,
          lg: 240
        },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
      }}
      padding='md'
      className='relative'>
      <AppShell.Header>
        <Group h='100%' px='md' wrap='nowrap'>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
          {/* Header */}
          <Header />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        {/* Navbar */}
        <Sidebar />
      </AppShell.Navbar>
      <AppShell.Main>
        <ScrollArea
          viewportRef={viewportRef}
          h={`calc(100vh - ${rem(80)} - 2rem)`}
          scrollHideDelay={500}
          scrollbarSize={5}
          onScrollPositionChange={debounce((position) => setScrollY(position.y), 200)}>
          {children}
        </ScrollArea>

        <ToTopButton viewportRef={viewportRef} />

        <FloatingButton />
      </AppShell.Main>
    </AppShell>
  );
};

export default DefaultLayout;
