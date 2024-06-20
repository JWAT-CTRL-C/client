import { useState, useEffect } from 'react';
import Logo from './logo';
import AvatarComp from '@/components/avatar';
import { Group, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';

import { FaBlog, FaBriefcase, FaBuffer, FaUserSecret } from 'react-icons/fa';
import { Can } from '@/providers/AbilityProvider';

const Header = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (router.pathname.startsWith('/dashboard')) {
      setActiveTab('dashboard');
    } else if (router.pathname.startsWith('/blogs')) {
      setActiveTab('blogs');
    } else if (router.pathname.startsWith('/workspaces')) {
      setActiveTab('workspaces');
    } else if (router.pathname.startsWith('/admin')) {
      setActiveTab('admin');
    }
  }, [router.pathname]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value) {
      router.push(`/${value}`);
    }
  };

  return (
    <header className='py-auto flex w-full items-center justify-between gap-2'>
      <Logo />
      <Group justify='space-between' align='center' gap='lg'>
        <Tabs value={activeTab} onChange={handleTabChange} variant='default' radius='md'>
          <Tabs.List style={{ display: 'flex', width: '100%' }}>
            <Can I='reach' a='AdminPage'>
              <Tabs.Tab
                size={'lg'}
                className='w-1/4 flex-1 border-b-2 md:px-8'
                classNames={{
                  tabLabel: 'flex-center gap-2'
                }}
                value='admin'>
                <FaUserSecret className='size-4 max-md:size-5' />
                <span className='max-md:hidden'>Admin</span>
              </Tabs.Tab>
            </Can>
            <Tabs.Tab
              size={'lg'}
              className='w-1/4 flex-1 border-b-2 md:px-8'
              classNames={{
                tabLabel: 'flex-center gap-2'
              }}
              value='dashboard'>
              <FaBuffer className='size-4 max-md:size-5' />
              <span className='max-md:hidden'>Dashboard</span>
            </Tabs.Tab>
            <Tabs.Tab
              size={'lg'}
              value='blogs'
              className='w-1/4 flex-1 border-b-2 md:px-8'
              classNames={{
                tabLabel: 'flex-center gap-2'
              }}>
              <FaBlog className='size-4 max-md:size-5' />
              <span className='max-md:hidden'>Blogs</span>
            </Tabs.Tab>
            <Tabs.Tab
              size={'lg'}
              className='w-1/4 flex-1 border-b-2 md:px-8'
              classNames={{
                tabLabel: 'flex-center gap-2'
              }}
              value='workspaces'>
              <FaBriefcase className='size-4 max-md:size-5' />
              <span className='max-md:hidden'>Workspaces</span>
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
