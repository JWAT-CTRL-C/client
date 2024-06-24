import { NOTIFICATION_TYPE } from '@/services/workspaceServices';
import { Avatar, Badge, Divider, Spoiler, Text } from '@mantine/core';
import colors from '@/assets/json/color_background_theme.json';
import _ from 'lodash';
import { convertIsoToDate } from '@/libs/utils';

export default function NotificationListItem({ item }: { item: NOTIFICATION_TYPE }) {
  const avatarSrc = _.isEmpty(item.user)
    ? 'https://placehold.co/50x50/blue/white?text=Sys'
    : item.user.avatar ??
      `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${item.user.fuln?.substring(0, 1)}`;
  const memeberAttribute = {
    HM: { color: 'orange', roleName: 'Head Master' },
    MA: { color: 'red', roleName: 'Master Admin' },
    PM: { color: 'yellow', roleName: 'Project Manager' },
    EM: { color: 'green', roleName: 'Employee' },
    default: { color: 'blue', roleName: 'System' }
  };
  return (
    <div className='mt-4 w-full bg-card p-5 pb-7 shadow-md'>
      <div className='flex gap-4'>
        <Avatar src={avatarSrc} alt={item.user.usrn} />
        <div className='w-full'>
          <Text className='text-xl font-bold'>{item.noti_tle} </Text>
          <div className='mb-3 pl-2 text-xs text-slate-500'>
            Creator: {item.user.fuln}
            <Badge
              size='sm'
              variant='light'
              color={memeberAttribute[item.user.role ?? 'default'].color}
              ml={'xs'}>
              {memeberAttribute[item.user.role ?? 'default'].roleName}
            </Badge>
          </div>
          <Divider size={'xs'} />
        </div>
      </div>
      <div className='mt-2 grid gap-2 pl-[8%]'>
        <Spoiler maxHeight={120} showLabel='Show more' hideLabel='Hide'>
          <Text>{item.noti_cont}</Text>
        </Spoiler>
        <Text size='xs' c='gray.6'>
          {convertIsoToDate(item.crd_at)}
        </Text>
      </div>
    </div>
  );
}
