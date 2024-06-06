import { SidebarConfig } from '@/libs/types/sidebarType';
import { FaHistory, FaHome, FaNetworkWired, FaNewspaper, FaPlusSquare, FaTasks } from 'react-icons/fa';

export const sidebarConfig: SidebarConfig = {
  blogConfig: [
    { link: '/blog', label: 'Home', icon: <FaHome size={20} /> },
    { link: '/blog/create', label: 'New blog', icon: <FaPlusSquare size={20} /> },
    { link: '/blog/yourBlog', label: 'Your blog', icon: <FaNewspaper size={20} /> }
  ],
  workspaceConfig: [
    { link: '/workspaces', label: 'Home', icon: <FaHome size={20} /> },
    { link: '/workspaces/task', label: 'Task', icon: <FaTasks size={20} /> },
    { link: '/workspaces/history', label: 'History', icon: <FaHistory size={20} /> },
    { link: '/workspaces/create', label: 'New work space', icon: <FaNetworkWired size={20} /> }
  ]
};
