import _ from 'lodash';

import colors from '@/assets/json/color_background_theme.json';
import { memberAttribute } from '@/libs/constants/memberAttribute';
import { cn, convertIsoToDateTime } from '@/libs/utils';
import { Avatar, Badge, Button, Divider, Indicator, rem, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ModalContent from '@/components/Notifications/ModalContent';
import { Noti } from '@/libs/types/notiType';
import ShowContent from '@/components/EditorContent';
import { FaRegTrashAlt } from 'react-icons/fa';
import PopoverConfirm from '@/components/popoverConfirm';

export default function NotificationListItem({
  item,
  enableEdit = false,
  removePending = false,
  handleRemove = () => {}
}: {
  item: Noti;
  enableEdit?: boolean;
  removePending?: boolean;
  handleRemove?: (noti_id: string) => void;
}) {
  const avatarSrc = _.isEmpty(item.user)
    ? 'https://placehold.co/50x50/4191FF/white?text=Sys'
    : item.user.avatar ??
      `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${item.user.fuln?.substring(0, 1)}`;
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <div className='relative mt-4 w-full rounded-xl bg-muted shadow-md'>
        <div className='w-full cursor-pointer p-5 pb-7' onClick={toggle}>
          <div className='flex-start gap-4'>
            <Avatar src={avatarSrc} alt={item.user?.usrn ?? 'System'} />
            <div className='w-full'>
              <Indicator
                color='blue'
                disabled={!enableEdit ? item.is_read : enableEdit}
                label='New'
                size={16}
                zIndex={20}>
                <Text className='line-clamp-1 w-full text-xl font-bold'>{item.noti_tle}</Text>
              </Indicator>
              <div className='mb-3 text-xs text-slate-500'>
                {item.user?.fuln ?? null}
                <Badge
                  size='sm'
                  variant='light'
                  color={memberAttribute[item.user?.role ?? 'default'].color}
                  ml='xs'>
                  {memberAttribute[item.user?.role ?? 'default'].roleName}
                </Badge>
              </div>
            </div>
          </div>
          <Divider size='xs' />
          <div className='mt-2 grid gap-2 pl-[8%]'>
            <ShowContent content={item.noti_cont} className='line-clamp-2' />
            <Text size='xs' c='gray.6'>
              {convertIsoToDateTime(item.crd_at)}
            </Text>
          </div>
        </div>
        <span className={cn('absolute right-0 top-0 p-0', enableEdit ? 'block' : 'hidden')}>
          <PopoverConfirm onConfirm={() => handleRemove(item.noti_id)} title='Confirm to delete?'>
            <Button
              variant='subtle'
              color='red.4'
              size='xs'
              className='rounded-xl p-1 px-2'
              loading={removePending}>
              <FaRegTrashAlt size={16} />
            </Button>
          </PopoverConfirm>
        </span>
      </div>
      <ModalContent notification={item} opened={opened} handleClose={toggle} enableEdit={enableEdit} />
    </>
  );
}
