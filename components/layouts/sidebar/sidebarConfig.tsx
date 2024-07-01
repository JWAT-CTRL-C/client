import { SidebarConfig } from '@/libs/types/sidebarType';
import { NextRouter } from 'next/router';
import {
  FaBell,
  FaBlog,
  FaBriefcase,
  FaBullhorn,
  FaDesktop,
  FaEdit,
  FaHome,
  FaNewspaper,
  FaPlusSquare,
  FaUser
} from 'react-icons/fa';

export const sidebarConfig = (router: NextRouter): SidebarConfig => {
  return {
    blogConfig: [
      { link: '/blogs', label: 'Home', icon: <FaHome size={20} /> },
      { link: '/blogs/create', label: 'New blog', icon: <FaPlusSquare size={20} /> },
      { link: '/blogs/myBlogs', label: 'My blogs', icon: <FaNewspaper size={20} /> }
    ],
    workspaceConfig: [
      { link: '/workspaces', label: 'Home', icon: <FaHome size={20} /> },
      { link: `/workspaces/${router.query.id}`, label: 'Surface', icon: <FaDesktop size={20} /> },
      {
        link: `/workspaces/${router.query.id}/notifications`,
        label: 'Notifications',
        icon: <FaBullhorn size={20} />
      },
      { link: `/workspaces/${router.query.id}/edit`, label: 'Setting', icon: <FaEdit size={20} /> }

      // { link: '/workspaces/task', label: 'Task', icon: <FaTasks size={20} /> },
      // { link: '/workspaces/history', label: 'History', icon: <FaHistory size={20} /> }
      // { link: '/workspaces/create', label: 'New workspace', icon: <FaNetworkWired size={20} /> }
    ],
    dashboardConfig: [{ link: '/dashboard', label: 'Home', icon: <FaHome size={20} /> }],
    adminConfig: [
      { link: '/admin', label: 'Users', icon: <FaUser size={20} /> },
      { link: '/admin/blogs', label: 'Blogs', icon: <FaBlog size={20} /> },
      { link: '/admin/workspaces', label: 'Workspaces', icon: <FaBriefcase size={20} /> },
      { link: '/admin/notifications', label: 'Notifications', icon: <FaBell size={20} /> }
    ]
  };
};
