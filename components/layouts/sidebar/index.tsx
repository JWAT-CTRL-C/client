import Avatar from '@/components/avatar';
import { Group, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiKey, BiLogoLinkedinSquare } from 'react-icons/bi';
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
import { FiLogOut, FiUser } from 'react-icons/fi';
import { SiEclipseadoptium } from 'react-icons/si';

const blogConfig = [
  { link: '/blog', label: 'Home', icon: <FaHome size={20} /> },
  { link: '/newBlog', label: 'New blog', icon: <FaPlusSquare size={20} /> },
  { link: '/yourBlog', label: 'Your blog', icon: <FaNewspaper size={20} /> }
];

const workspaceConfig = [
  { link: '/workspace', label: 'Home', icon: <FaHome size={20} /> },
  { link: '/task', label: 'Task', icon: <FaTasks size={20} /> },

  { link: '/history', label: 'History', icon: <FaHistory size={20} /> },
  { link: '/newWorkspace', label: 'New work space', icon: <FaNetworkWired size={20} /> }
];

const Sidebar = () => {
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
    <div className='my-auto flex  h-full flex-col justify-between   text-white'>
      <div>
        {sidebarState.map((item) => (
          <Group
            key={item.link}
            className={`cursor-pointer p-4 hover:bg-primary ${active === item.link && 'bg-primary'}`}
            onClick={() => handleToPage(item.link)}>
            {item.icon}
            <Text>{item.label}</Text>
          </Group>
        ))}
      </div>
      <div className=''>
        <Group className='cursor-pointer p-4 hover:bg-primary'>
          <FaUserCog size={20} />
          <Text>Change account</Text>
        </Group>

        <Group className='cursor-pointer p-4 hover:bg-primary' onClick={() => router.push('auth')}>
          <FaSignOutAlt size={20} />
          <Text>Logout</Text>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
