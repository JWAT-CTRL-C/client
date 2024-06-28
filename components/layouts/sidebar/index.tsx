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
  }, [router.pathname]);

  const handleToPage = (link: string) => {
    router.push(link);
  };

  return (
    <div className='my-auto flex h-full flex-col justify-between'>
      <div>
        {sidebarState.map((item) => {
          const isActive = router.pathname === item.link;

          return (
            <NavLink
              key={item.label}
              active={isActive}
              label={item.label}
              className={`my-5 cursor-pointer rounded-md p-4`}
              onClick={() => handleToPage(item.link)}
              leftSection={item.icon}
            />
          );
        })}
      </div>

      <div>
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
