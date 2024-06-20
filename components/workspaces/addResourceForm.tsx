import { useCreateResource } from '@/libs/hooks/mutations/resourceMutations';
import { Box, Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showErrorToast, showSuccessToast } from '../shared/toast';
import { useRouter } from 'next/router';

export type AddResourceFormType = {
  opened: boolean;
  handleClose: () => void;
};
export default function AddResourceForm({ opened, handleClose }: AddResourceFormType) {
  const router = useRouter();
  const wksp_id = router.query.id as string;
  const form = useForm({
    initialValues: {
      resrc_name: '',
      resrc_url: ''
    },
    validate: {
      resrc_name: (value) => (value ? null : 'Resource name is required'),
      resrc_url: (value) => {
        if (!value) {
          return 'Resource URL is required';
        }
        if (
          !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(
            value
          )
        ) {
          return 'Invalid URL';
        }
        return null;
      }
    }
  });
  const handleSuccess = () => {
    showSuccessToast('Resource created successfully');
    handleClose();
    form.reset();
    return { wksp_id: wksp_id };
  };
  const handleFail = () => {
    form.reset();
    showErrorToast('Fail to create resource');
  };
  const { createResource, isPending, isError } = useCreateResource(handleSuccess, handleFail);
  const handleSubmit = (value: typeof form.values) => {
    createResource({ wksp_id, resource: value });
  };
  const handleCancel = () => {
    handleClose();
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={handleClose} centered closeOnClickOutside={false} size='lg'>
      <h1 className='text-center text-2xl font-semibold capitalize'>New resouce</h1>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='grid gap-2 p-5'>
        <TextInput label='Resource Name' withAsterisk {...form.getInputProps('resrc_name')} />
        <TextInput label='Resource URL' withAsterisk {...form.getInputProps('resrc_url')} type='url' />
        <Group mt='md' justify='center'>
          <Button onClick={() => handleCancel()} variant='outline' color='red' className='flex-grow'>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='filled'
            className='flex-grow'
            loading={isPending}
            disabled={isPending}>
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
