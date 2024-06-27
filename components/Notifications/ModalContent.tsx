import { Noti } from '@/libs/types/notiType';
import { Avatar, Badge, Button, Group, Modal, Text } from '@mantine/core';
import ShowContent from '../EditorContent';
import { avatarSrc } from '@/libs/constants/avatarSrc';
import { convertIsoToDateTime } from '@/libs/utils';

export interface IModalContentProps {
  notification: Noti;
  opened: boolean;
  handleClose: () => void;
}

export default function ModalContent({ notification, handleClose, opened }: IModalContentProps) {
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      size='lg'
      centered>
      <div className='space-y-2 p-5'>
        <div className='mb-5 flex flex-col gap-4'>
          <Group>
            <Avatar src={avatarSrc(notification)} alt={notification.user?.fuln ?? 'System'} radius='xl' />
            <div>
              <Text fz='sm'>{notification.user?.fuln ?? 'System'}</Text>
              <div className='flex-start gap-2'>
                <Text fz='xs' c='dimmed'>
                  {convertIsoToDateTime(notification.crd_at)}
                </Text>

                <Badge color={notification.workspace ? 'green.6' : 'blue'} variant='filled' size='xs'>
                  {notification.workspace ? notification.workspace.wksp_name : 'Global'}
                </Badge>
              </div>
            </div>
          </Group>
          <h1 className='line-clamp-1 text-xl font-semibold uppercase'>{notification.noti_tle}</h1>
        </div>

        <ShowContent content={notification.noti_cont} />

        <Group justify='space-between'>
          <div />

          <Button onClick={handleClose} variant='outline' color='red'>
            Close
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
