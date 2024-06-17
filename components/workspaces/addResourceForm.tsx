import { Box, Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export type AddResourceFormType = {
  opened: boolean;
  handleClose: () => void;
};
export default function AddResourceForm({ opened, handleClose }: AddResourceFormType) {
  const form = useForm({
    initialValues: {
      resrc_name: '',
      resrc_url: ''
    }
  });
  const handleSubmit = (value: typeof form.values) => {
    console.log(value);
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
          <Button type='submit' variant='filled' className='flex-grow'>
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
