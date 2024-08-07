import { useCreateWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { CREATE_WORKSPACE_REQUEST } from '@/services/workspaceServices';
import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AxiosError, isAxiosError } from 'axios';
import { showErrorToast, showSuccessToast } from '../shared/toast';

export type WorkspaceCreateFormType = {
  opened: boolean;
  handleClose: () => void;
};

export default function CreateWorkspaceForm({ opened, handleClose }: WorkspaceCreateFormType) {
  const form = useForm({
    initialValues: {
      wksp_name: '',
      wksp_desc: ''
    },
    validate: {
      wksp_name: (value: string) => {
        return value.length == 0
          ? 'Please enter a name'
          : value.length > 50
            ? 'Name should be less than 50 characters'
            : null;
      },
      wksp_desc: (value: string) => {
        return value.trim().length == 0
          ? 'Please enter a description'
          : value.split(' ').length > 150
            ? `Description should be less than 150 words! Current length: ${value.split(' ').length} words`
            : null;
      }
    }
  });
  const handleCancel = () => {
    handleClose();
    form.reset();
  };
  const handleSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    showSuccessToast(data.message);
    form.reset();
    handleClose();
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
    }
    handleClose();
    form.reset();
  };
  const { createWorkspace, isPending } = useCreateWorkspace(handleSuccess, handleFail);
  const handleSubmit = (value: typeof form.values) => {
    createWorkspace(value as unknown as CREATE_WORKSPACE_REQUEST);
  };
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      size='lg'
      centered>
      <form className='p-5' onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className='text-center text-2xl font-semibold uppercase'>Create Workspace</h1>
        <TextInput
          mt='lg'
          withAsterisk
          label='Workspace Name'
          placeholder='Workspace Name'
          key={form.key('wksp_name')}
          {...form.getInputProps('wksp_name')}
        />
        <Textarea
          mt='lg'
          withAsterisk
          inputSize='lg'
          label='Workspace Description'
          {...form.getInputProps('wksp_desc')}
        />
        <Group mt='md' justify='center'>
          <Button onClick={() => handleCancel()} variant='outline' color='red' className='flex-grow'>
            Cancel
          </Button>
          <Button type='submit' variant='filled' className='flex-grow' loading={isPending}>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
