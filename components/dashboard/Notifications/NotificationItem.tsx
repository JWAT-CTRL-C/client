import { Noti } from '@/libs/types/notiType';
import { Text, Avatar, Group, TypographyStylesProvider, Paper, Badge, Card, Indicator } from '@mantine/core';
import _ from 'lodash';
import ShowContent from '@/components/EditorContent';
import { useDisclosure } from '@mantine/hooks';
import ModalContent from '@/components/Notifications/ModalContent';
import { avatarSrc } from '@/libs/constants/avatarSrc';
import { convertIsoToDateTime } from '@/libs/utils';

interface INotificationItemProps {
  notification: Noti;
  toast?: boolean;
}

export function NotificationItem({ notification, toast = false }: INotificationItemProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Card withBorder radius='md' className='cursor-pointer px-5 py-4 shadow-md' onClick={toggle}>
        <Indicator
          color='blue'
          disabled={notification.is_read || toast}
          size={16}
          label='New'
          offset={7}
          zIndex={20}>
          <Group>
            <Avatar src={avatarSrc(notification)} alt={notification.user?.fuln ?? 'System'} radius='xl' />
            <div>
              <Text fz='sm'>{notification.user?.fuln ?? 'System'}</Text>
              <div className='md:flex-start gap-2'>
                <Text fz='xs' c='dimmed'>
                  {convertIsoToDateTime(notification.crd_at)}
                </Text>

                <Badge color={notification.workspace ? 'green.6' : 'blue'} variant='filled' size='xs'>
                  {notification.workspace ? notification.workspace.wksp_name : 'Global'}
                </Badge>
              </div>
            </div>
          </Group>
          <TypographyStylesProvider className='pl-14 pt-4'>
            <Text fz='h4' className='!mb-2 line-clamp-1 font-semibold'>
              {notification.noti_tle}
            </Text>
            <ShowContent className='line-clamp-2' content={notification.noti_cont} />
          </TypographyStylesProvider>
        </Indicator>
      </Card>
      <ModalContent notification={notification} opened={opened} handleClose={toggle} />
    </>
  );
}
