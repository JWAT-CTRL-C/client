import { SidebarConfig } from '@/libs/types/sidebarType';
import { FaHistory, FaHome, FaNetworkWired, FaNewspaper, FaPlusSquare, FaTasks } from 'react-icons/fa';

export const sidebarConfig: SidebarConfig = {
  blogConfig: [
    { link: '/blogs', label: 'Home', icon: <FaHome size={20} /> },
    { link: '/blogs/create', label: 'New blog', icon: <FaPlusSquare size={20} /> },
    { link: '/blogs/yourBlog', label: 'Your blog', icon: <FaNewspaper size={20} /> }
  ],
  workspaceConfig: [
    { link: '/workspaces', label: 'Home', icon: <FaHome size={20} /> },
    { link: '/workspaces/task', label: 'Task', icon: <FaTasks size={20} /> },
    { link: '/workspaces/history', label: 'History', icon: <FaHistory size={20} /> },
    { link: '/workspaces/create', label: 'New workspaces', icon: <FaNetworkWired size={20} /> }
  ]
};
