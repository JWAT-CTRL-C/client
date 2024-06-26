import _ from 'lodash';

import colors from '@/assets/json/color_background_theme.json';
import { Noti } from '@/libs/types/notiType';

export const avatarSrc = (notification: Noti) =>
  _.isEmpty(notification.user)
    ? 'https://placehold.co/50x50/4191FF/white?text=Sys'
    : notification.user?.avatar ??
      `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${notification.user.fuln?.substring(0, 1)}`;
