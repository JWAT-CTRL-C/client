import 'highlight.js/styles/default.css';

import { ReactNode, useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import { useReceiveNotifications } from '@/libs/hooks/mutations/notiMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { NotificationType } from '@/libs/types';
import { Noti } from '@/libs/types/notiType';
import { useStore } from '@/providers/StoreProvider';
import { Affix, AppShell, Burger, Button, Group, LoadingOverlay, rem, Transition } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';

import FloatingButton from '../FloatingButton';
import Header from './header';
import Sidebar from './sidebar';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { notificationSocket, setUser } = useStore((store) => store);

  const { user, isPending } = useMyInfo();
  const { receiveNotification } = useReceiveNotifications();

  const [scroll, scrollTo] = useWindowScroll();

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
      });
      setIsListening(true);
    }

    if (user) {
      setUser(user);
    }

    return () => {
      if (notificationSocket && isListening) {
        notificationSocket.off(NotificationType.NEW);
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
        {children}
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition='slide-up' mounted={scroll.y > 80}>
            {(transitionStyles) => (
              <Button
                leftSection={<FaArrowUp style={{ width: rem(16), height: rem(16) }} />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}>
                Scroll to top
              </Button>
            )}
          </Transition>
        </Affix>
        <FloatingButton />
      </AppShell.Main>
    </AppShell>
  );
};

export default DefaultLayout;
