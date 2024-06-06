import React, { ReactNode } from 'react';
import Sidebar from './sidebar';
import { AppShell, Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaAviato } from 'react-icons/fa';
import Header from './header';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
      }}
      padding='md'>
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
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default DefaultLayout;
