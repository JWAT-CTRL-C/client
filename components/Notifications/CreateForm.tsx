import { Button, Group, Input, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AxiosError, isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import TextEditor from './TextEditor';
import { useStore } from '@/providers/StoreProvider';
import { NotificationType } from '@/libs/types';
import { useEffect, useState } from 'react';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';

export type NotificationCreateFormType = {
  opened: boolean;
  handleClose: () => void;
};

export default function CreateNotificationForm({ opened, handleClose }: NotificationCreateFormType) {
  const { notificationSocket } = useStore((store) => store);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      noti_tle: '',
      noti_cont: ''
    },
    validate: {
      noti_tle: (value: string) => {
        return value.length == 0 ? 'Please enter a title' : null;
      },
      noti_cont: (value: string) => {
        return value.trim().length == 0 ? 'Please enter content' : null;
      }
    }
  });

  const { user } = useMyInfo();

  useEffect(() => {
    if (opened) {
      notificationSocket.on(NotificationType.SUCCESS, handleSuccess);
      notificationSocket.on(NotificationType.ERROR, handleFail);
    } else {
      notificationSocket.off(NotificationType.SUCCESS);
      notificationSocket.off(NotificationType.ERROR);
    }
  }, [opened]);

  const handleCancel = () => {
    handleClose();
    form.reset();
  };

  const handleSuccess = () => {
    setIsLoading(false);
    toast.success('Notification created successfully');
    form.reset();
    handleClose();
  };

  const handleFail = (err: Error | AxiosError) => {
    setIsLoading(false);
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
    form.reset();
    handleClose();
  };

  const handleSubmit = (value: typeof form.values) => {
    setIsLoading(true);
    notificationSocket.emit(NotificationType.CREATE_GLOBAL, { ...value, user_id: user!.user_id });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      size='xl'
      centered>
      <form className='space-y-2 p-5' onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className='text-center text-2xl font-semibold uppercase'>Create Notification</h1>
        <TextInput
          mt='lg'
          withAsterisk
          label='Notification title'
          placeholder='Notification title'
          {...form.getInputProps('noti_tle')}
        />

        <Input.Wrapper withAsterisk label='Notification content' error={form.errors.noti_cont}>
          <TextEditor form={form} />
        </Input.Wrapper>

        <Group mt='md' justify='center'>
          <Button onClick={() => handleCancel()} variant='outline' color='red' className='flex-grow'>
            Cancel
          </Button>
          <Button type='submit' variant='filled' className='flex-grow' loading={isLoading}>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
