import { WorkspaceType } from '@/libs/types/workspace';
import { Button, Group, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export type WorkspaceCreateFormType = {
  opened: boolean;
  handleClose: () => void;
};

export default function CreateWorkspaceForm({ opened, handleClose }: WorkspaceCreateFormType) {
  const form = useForm<WorkspaceType>({
    mode: 'uncontrolled',
    initialValues: {
      wkps_name: '',
      wkps_desc: ''
    },
    validate: {
      wkps_desc: (value: string) =>
        value.length > 150 ? 'Description should be less than 150 characters' : null
    }
  });
  return (
    <Modal opened={opened} onClose={handleClose} closeOnClickOutside={false} size='lg' centered>
      <form className='p-5'>
        <h1 className='text-center text-2xl font-semibold'>Create Workspace</h1>
        <TextInput
          mt='lg'
          withAsterisk
          label='Workspace Name'
          placeholder='Workspace Name'
          key={form.key('wkps_name')}
          {...form.getInputProps('wkps_name')}
        />
        <Textarea
          mt='lg'
          inputSize='lg'
          withAsterisk
          label='Workspace Description'
          {...form.getInputProps('wkps_desc')}
        />
        <Group mt='lg'>
          <Button type='submit' variant='pill' fullWidth>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
