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
  const isBlog = router.pathname.startsWith('/blog');
  const isWorkspace = router.pathname.startsWith('/workspaces');

  const [active, setActive] = useState(0);
  useEffect(() => {
    if (isBlog) {
      setSidebarState(blogConfig);
    }
    if (isWorkspace) {
      setSidebarState(workspaceConfig);
    }
    if (router.pathname === '/blog' || router.pathname === '/workspaces') {
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
        <Group className='my-3 cursor-pointer rounded-md p-4 hover:bg-primary'>
          <FaUserCog size={20} />
          <Text>Change account</Text>
        </Group>

        <Group
          className='my-3 cursor-pointer rounded-md p-4 hover:bg-primary'
          onClick={() => {
            signOut();
          }}>
          <FaSignOutAlt size={20} />
          <Text>Log out</Text>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
