import { NavLink } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { sidebarConfig } from './sidebarConfig';

import { removeUserAuth } from '@/libs/utils';
import ChangeInformation from '@/components/profile/ChangeInformation';

const Sidebar = () => {
  const { blogConfig, workspaceConfig, dashboardConfig, adminConfig } = sidebarConfig;
  const [sidebarState, setSidebarState] = useState(blogConfig);
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');
  const isBlog = router.pathname.startsWith('/blogs');
  const isWorkspace = router.pathname.startsWith('/workspaces');
  const isAdmin = router.pathname.startsWith('/admin');

  const [active, setActive] = useState<number | null>(0);
  useEffect(() => {
    if (isBlog) {
      setSidebarState(blogConfig);
    }
    if (isWorkspace) {
      setSidebarState(workspaceConfig);
    }
    if (isDashboard) {
      setSidebarState(dashboardConfig);
    }
    if (isAdmin) {
      setSidebarState(adminConfig);
    }
    if (
      router.pathname === '/blogs' ||
      router.pathname === '/workspaces' ||
      router.pathname === '/dashboard'
    ) {
      setActive(0);
    }
    const sidebarStatePath = sidebarState.map((state) => state.link);

    if (!sidebarStatePath.includes(router.pathname)) {
      if (
        router.pathname === '/blogs' ||
        router.pathname === '/workspaces' ||
        router.pathname === '/dashboard'
      ) {
        setActive(0);
      } else {
        setActive(null);
      }
    }
  }, [router.pathname]);

  const handleToPage = (link: string, index: number) => {
    router.push(link);
    setActive(index);
  };

  return (
    <div className='my-auto flex h-full flex-col justify-between'>
      <div>
        {sidebarState.map((item, index) => (
          <NavLink
            key={item.label}
            active={index === active}
            label={item.label}
            className={`my-5 cursor-pointer rounded-md p-4`}
            onClick={() => handleToPage(item.link, index)}
            leftSection={item.icon}></NavLink>
        ))}
      </div>
      <div className=''>
        <ChangeInformation />

        <NavLink
          label={'Log out'}
          className={`my-5 cursor-pointer rounded-md p-4`}
          onClick={() => {
            router.push('/auth');
            removeUserAuth();
          }}
          leftSection={<FaSignOutAlt size={20} />}></NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
