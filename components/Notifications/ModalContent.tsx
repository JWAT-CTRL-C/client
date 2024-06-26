import { Noti } from '@/libs/types/notiType';
import { Avatar, Badge, Button, Group, Modal, Text } from '@mantine/core';
import ShowContent from '../EditorContent';
import { avatarSrc } from '@/libs/constants/avatarSrc';
import { convertIsoToDateTime } from '@/libs/utils';
import { useMarkSeenNotification } from '@/libs/hooks/mutations/notiMutations';

export interface IModalContentProps {
  notification: Noti;
  opened: boolean;
  enableEdit?: boolean;
  handleClose: () => void;
}

export default function ModalContent({
  notification,
  handleClose,
  opened,
  enableEdit = false
}: IModalContentProps) {
  const { markSeen, isPending, isError } = useMarkSeenNotification(notification.workspace?.wksp_id);
  const handleWhenClose = () => {
    if (!notification.is_read && !enableEdit) markSeen(notification.noti_id);
    handleClose();
  };
  return (
    <Modal
      opened={opened}
      onClose={handleWhenClose}
      size='lg'
      centered
      title={
        <Group px='md'>
          <Avatar src={avatarSrc(notification)} alt={notification.user?.fuln ?? 'System'} radius='xl' />
          <div>
            <Text fz='md' fw={500}>
              {notification.user?.fuln ?? 'System'}
            </Text>
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
      }>
      <div className='space-y-2 p-5'>
        <div className='mb-5 flex flex-col gap-4'>
          <h1 className='line-clamp-1 text-xl font-semibold uppercase'>{notification.noti_tle}</h1>
        </div>

        <ShowContent content={notification.noti_cont} />

        <Group justify='space-between'>
          <div />

          {/* <Button onClick={handleClose} variant='outline' color='red'>
            Close
          </Button> */}
        </Group>
      </div>
    </Modal>
  );
}
