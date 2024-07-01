import { NavLink } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { sidebarConfig } from './sidebarConfig';

import { removeUserAuth } from '@/libs/utils';
import ChangeInformation from '@/components/profile/ChangeInformation';
import { useAbility } from '@/providers/AbilityProvider';
import { subject } from '@casl/ability';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';

const Sidebar = () => {
  const router = useRouter();
  const { blogConfig, workspaceConfig, dashboardConfig, adminConfig } = sidebarConfig(router);
  const ability = useAbility();
  const [sidebarState, setSidebarState] = useState(blogConfig);
  const isDashboard = router.pathname.startsWith('/dashboard');
  const isBlog = router.pathname.startsWith('/blogs');
  const isWorkspace = router.pathname.startsWith('/workspaces');
  const isOneWorkspace = router.pathname.startsWith('/workspaces/[id]');
  const isAdmin = router.pathname.startsWith('/admin');

  const { workspace } = useFetchWorkspaceById(router.query.id as string);
  const canEditWorkspaceNoti = ability.can('reach', subject('workspace', workspace!));
  const canEditWorkspace = ability.can('edit', subject('workspace', workspace!));
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
          const isActive = router.asPath === item.link;
          switch (item.label) {
            case 'Notifications':
              if ((isOneWorkspace && !canEditWorkspaceNoti) || router.asPath === '/workspaces') {
                return null;
              }
            case 'Setting':
              if ((isOneWorkspace && !canEditWorkspace) || router.asPath === '/workspaces') {
                return null;
              }
            case 'Surface':
              if (!isOneWorkspace) {
                return null;
              }
            default:
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
          }
        })}
      </div>

      <div>
        <ChangeInformation />

        <NavLink
          label='Log out'
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
