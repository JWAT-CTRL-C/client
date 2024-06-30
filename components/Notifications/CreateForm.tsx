import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useReceiveNotifications } from '@/libs/hooks/mutations/notiMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import { NotificationType } from '@/libs/types';
import { Noti } from '@/libs/types/notiType';
import { useAbility } from '@/providers/AbilityProvider';
import { useStore } from '@/providers/StoreProvider';
import { Button, ComboboxItem, Group, Input, Modal, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import TextEditor from './TextEditor';

export type NotificationCreateFormType = {
  opened: boolean;
  handleClose: () => void;
};

export default function CreateNotificationForm({ opened, handleClose }: NotificationCreateFormType) {
  const { notificationSocket } = useStore((store) => store);
  const { query, pathname } = useRouter();

  const ability = useAbility();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | undefined>(undefined);
  const [workspaceOptions, setWorkspaceOptions] = useState<ComboboxItem[]>([]);

  const form = useForm<{
    noti_tle: string;
    noti_cont: string;
    wksp_id: string | null;
  }>({
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
  }, [pathname, workspaceOptions, opened]);

  useEffect(() => {
    if (workspaces) {
      const options = workspaces.map((workspace) => ({
        value: workspace.wksp_id.toString(),
        label: workspace.wksp_name
      }));
      setWorkspaceOptions(options);
    }
  }, [workspaces]);

  const canCreateGlobalNoti = ability.can('create', 'global_notification');

  const handleCancel = () => {
    handleClose();
    form.reset();
  };

  const handleSuccess = () => {
    setIsLoading(false);
    showSuccessToast('Notification created successfully');
    form.reset();
    handleClose();
  };

  const handleFail = (err: Error | AxiosError) => {
    setIsLoading(false);
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
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
          disabled={!workspaceOptions.length || !canCreateGlobalNoti}
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
