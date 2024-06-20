import { ReactNode, useEffect, useState } from 'react';

import { AppShell, Burger, Group, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NotificationType } from '@/libs/types';

import Header from './header';
import Sidebar from './sidebar';
import { useStore } from '@/providers/StoreProvider';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { notificationSocket, setRole } = useStore((store) => store);

  const { user, isPending } = useMyInfo();

  // prevent hydration error
  const [loader, setLoader] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setLoader(true);

    if (notificationSocket && user && !isListening) {
      notificationSocket.emit(NotificationType.SETUP_USER, { user_id: user.user_id });
      for (const workspace of user.workspaces) {
        notificationSocket.emit(NotificationType.SETUP_WORKSPACE, { wksp_id: workspace.wksp_id });
      }
      notificationSocket.on(NotificationType.NEW, (data: any) => {
        console.log(data);
      });
      setIsListening(true);
    }

    if (user) {
      setRole(user.role);
    }

    return () => {
      if (notificationSocket) {
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
        width: 300,
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
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default DefaultLayout;
