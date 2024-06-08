import { WorkspacePayloadType, WorkspaceType } from '@/libs/types/workspace';
import { Button, Divider, Group, Textarea, TextInput } from '@mantine/core';
import { useField, useForm } from '@mantine/form';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

export default function EditGeneralWorkspaceForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      wkps_name: '',
      wkps_desc: '',
      resources: []
    },
    validate: {
      wkps_desc: (value: string) =>
        value.length > 150 ? 'Description should be less than 150 characters' : null
    }
  });

  // field
  const field = useField({
    initialValue: ''
  });
  const handleAddResource = () => {
    form.insertListItem('resources', [...form.values.resources, field.getValue()]);
  };
  return (
    <form className='p-5' onSubmit={form.onSubmit((values) => console.log(values))}>
      <h1 className='text-center text-2xl font-semibold'>Edit Workspace</h1>
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
      <Divider my='sm' label='Resources' labelPosition='left' />
      <Group>
        <TextInput mt='lg' placeholder='Resource url' type='url' {...field.getInputProps()} />
        <Button variant='filled' radius='100' mt='lg' color='violet' onClick={() => handleAddResource()}>
          <FaPlus />
        </Button>
      </Group>
      <Group mt='lg'>
        <Button type='submit' variant='pill' fullWidth>
          Save
        </Button>
      </Group>
    </form>
  );
}
