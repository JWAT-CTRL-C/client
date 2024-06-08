import { Group, NavLink, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { sidebarConfig } from './sidebarConfig';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const { blogConfig, workspaceConfig } = sidebarConfig;
  const [sidebarState, setSidebarState] = useState(blogConfig);
  const router = useRouter();
  const isBlog = router.pathname.startsWith('/blogs');
  const isWorkspace = router.pathname.startsWith('/workspaces');

  const [active, setActive] = useState(0);
  useEffect(() => {
    if (isBlog) {
      setSidebarState(blogConfig);
    }
    if (isWorkspace) {
      setSidebarState(workspaceConfig);
    }
    if (router.pathname === '/blogs' || router.pathname === '/workspaces') {
      setActive(0);
    }
  }, [router.pathname]);

  const handleToPage = (link: string, index: number) => {
    router.push(link);
    setActive(index);
  };

  return (
    <div className='my-auto flex  h-full flex-col justify-between   '>
      <div>
        {sidebarState.map((item, index) => (
          <NavLink
            key={item.label}
            active={index === active}
            label={item.label}
            className={`my-5 cursor-pointer rounded-md p-4 `}
            onClick={() => handleToPage(item.link, index)}
            leftSection={item.icon}></NavLink>
        ))}
      </div>
      <div className=''>
        <NavLink
          label={'Change account'}
          className={`my-5 cursor-pointer rounded-md p-4 `}
          leftSection={<FaUserCog size={20} />}></NavLink>

        <NavLink
          label={'Log out'}
          className={`my-5 cursor-pointer rounded-md p-4 `}
          onClick={() => {
            signOut();
          }}
          leftSection={<FaSignOutAlt size={20} />}></NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
