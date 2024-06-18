import { useCreateResource, useUpdateResource } from '@/libs/hooks/mutations/resourceMutations';
import { Box, Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showErrorToast, showSuccessToast } from '../shared/toast';
import { useRouter } from 'next/router';
import { RESOURCE_TYPE } from '@/services/resourceServices';
import _ from 'lodash';

export type EditResourceFormType = {
  data: RESOURCE_TYPE;
  opened: boolean;
  handleClose: () => void;
};
export default function EditResourceForm({ data, opened, handleClose }: EditResourceFormType) {
  const router = useRouter();
  const wksp_id = router.query.id as string;
  const form = useForm({
    initialValues: data,
    validate: {
      resrc_name: (value) => (value ? null : 'Resource name is required'),
      resrc_url: (value) => (value ? null : 'Resource url is required')
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
  const { updateResource, isPending, isError } = useUpdateResource(handleSuccess, handleFail);
  const handleSubmit = (value: typeof form.values) => {
    updateResource({ wksp_id, resrc_id: value.resrc_id, resource: _.omit(value, 'resrc_id') });
  };
  const handleCancel = () => {
    handleClose();
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={handleClose} centered closeOnClickOutside={false} size='lg'>
      <h1 className='text-center text-2xl font-semibold capitalize'>Edit resouce</h1>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='grid gap-2 p-5'>
        <h3 className='text-md my-2 text-start'>Original name: {data.resrc_name}</h3>
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
