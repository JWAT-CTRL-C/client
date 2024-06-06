import { Group, NavLink, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FaHistory,
  FaHome,
  FaNetworkWired,
  FaNewspaper,
  FaPlusSquare,
  FaSignOutAlt,
  FaTasks,
  FaUserCog
} from 'react-icons/fa';
import { sidebarConfig } from './sidebarConfig';

const Sidebar = () => {
  const { blogConfig, workspaceConfig } = sidebarConfig;
  const [sidebarState, setSidebarState] = useState(blogConfig);
  const router = useRouter();
  const isBlog = router.pathname.startsWith('/blog');
  const isWorkspace = router.pathname.startsWith('/workspace');
  const [active, setActive] = useState(isBlog ? blogConfig[0].link : workspaceConfig[0].link);

  useEffect(() => {
    if (isBlog) {
      setSidebarState(blogConfig);
    }
    if (isWorkspace) {
      setSidebarState(workspaceConfig);
    }
    setActive(isBlog ? blogConfig[0].link : workspaceConfig[0].link);
  }, [router.pathname]);

  const handleToPage = (link: string) => {
    setActive(link);
    router.push(link);
  };

  return (
    <div className='my-auto flex  h-full flex-col justify-between   '>
      <div>
        {sidebarState.map((item) => (
          <NavLink
            key={item.link}
            active={active === item.link}
            label={item.label}
            className={`my-5 cursor-pointer rounded-md p-4 `}
            onClick={() => handleToPage(item.link)}
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
          onClick={() => router.push('auth')}>
          <FaSignOutAlt size={20} />
          <Text>Logout</Text>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
