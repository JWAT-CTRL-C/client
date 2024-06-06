import React, { useState, useEffect } from 'react';
import Logo from './logo';
import AvatarComp from '@/components/avatar';
import { Group, Tabs, rem } from '@mantine/core';
import { useRouter } from 'next/router';

import { FaBlog, FaBriefcase } from 'react-icons/fa';

const Header = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (router.pathname.startsWith('/blog')) {
      setActiveTab('blog');
    } else if (router.pathname.startsWith('/workspaces')) {
      setActiveTab('workspaces');
    }
  }, [router.pathname]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value) {
      router.push(`/${value}`);
    }
  };

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <header className='py-auto  flex w-full items-center justify-between gap-2'>
      <Logo />
      <Group justify='space-between' align='center' gap='lg'>
        <Tabs value={activeTab} onChange={handleTabChange} variant='default' radius='md'>
          <Tabs.List style={{ display: 'flex', width: '100%' }}>
            <Tabs.Tab
              size={'lg'}
              value='blog'
              className='w-1/3 flex-1  border-b-2 md:px-8'
              leftSection={<FaBlog style={iconStyle} />}>
              Blog
            </Tabs.Tab>
            <Tabs.Tab
              size={'lg'}
              className='w-1/3 flex-1  border-b-2 md:px-8'
              value='workspaces'
              leftSection={<FaBriefcase style={iconStyle} />}>
              Workspaces
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Group>
      <div className='mr-4'>
        <AvatarComp />
      </div>
    </header>
  );
};

export default Header;
