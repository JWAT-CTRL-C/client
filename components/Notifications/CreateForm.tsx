import { Button, ComboboxItem, Group, Input, Modal, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AxiosError, isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import TextEditor from './TextEditor';
import { useStore } from '@/providers/StoreProvider';
import { NotificationType } from '@/libs/types';
import { useEffect, useState } from 'react';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import { useRouter } from 'next/router';
import { useReceiveNotifications } from '@/libs/hooks/mutations/notiMutations';
import { Noti } from '@/libs/types/notiType';

export type NotificationCreateFormType = {
  opened: boolean;
  handleClose: () => void;
};

export default function CreateNotificationForm({ opened, handleClose }: NotificationCreateFormType) {
  const { notificationSocket } = useStore((store) => store);
  const { query, pathname } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | undefined>(undefined);

  const form = useForm<{
    noti_tle: string;
    noti_cont: string;
    wksp_id: string | null;
  }>({
    mode: 'uncontrolled',
    initialValues: {
      noti_tle: '',
      noti_cont: '',
      wksp_id: null
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
  const { workspaces } = useFetchWorkspacesByUser();

  const { receiveNotification } = useReceiveNotifications();

  const [workspaceOptions, setWorkspaceOptions] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    if (opened) {
      notificationSocket.on(NotificationType.SUCCESS, handleSuccess);
      notificationSocket.on(NotificationType.ERROR, handleFail);
    } else {
      notificationSocket.off(NotificationType.SUCCESS);
      notificationSocket.off(NotificationType.ERROR);
    }
  }, [opened]);

  useEffect(() => {
    if (pathname.includes('workspaces')) {
      if (workspaceOptions.find((option) => option.value === (query.id as string))) {
        form.setValues({
          noti_cont: '',
          noti_tle: '',
          wksp_id: query.id as string
        });
        setSelectedWorkspace(
          workspaceOptions.find((option) => option.value === (query.id as string))?.label ?? ''
        );
      }
    }
  }, [pathname, workspaceOptions]);

  useEffect(() => {
    if (workspaces) {
      const options = workspaces.map((workspace) => ({
        value: workspace.wksp_id.toString(),
        label: workspace.wksp_name
      }));
      setWorkspaceOptions(options);
    }
  }, [workspaces]);

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
    if (value.wksp_id) {
      notificationSocket.emit(NotificationType.CREATE_WORKSPACE, { ...value, user_id: user!.user_id }, () => {
        const newNotification = {
          ...value,
          workspace: {
            wksp_id: value.wksp_id,
            wksp_name: selectedWorkspace!
          },
          user: user!
        };
        receiveNotification(newNotification as unknown as Noti);
      });
    } else {
      notificationSocket.emit(NotificationType.CREATE_GLOBAL, { ...value, user_id: user!.user_id });
    }
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

        <Select
          mt='lg'
          searchable
          clearable
          label='Workspace'
          data={workspaceOptions}
          nothingFoundMessage='No workspace available'
          disabled={!workspaceOptions.length}
          placeholder='Leave empty for global notification'
          {...form.getInputProps('wksp_id')}
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
