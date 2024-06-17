import { Button, ButtonGroup, Divider, Group, Text, Textarea, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';
import AddResourceForm from './addResourceForm';
import { ResourceItemType } from '@/libs/types/workspace';
import { useGetAllResourcesByWorkspace } from '@/libs/hooks/queries/resourceQueries';
import { useRouter } from 'next/router';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { useUpdateWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { SPECIFIC_WORKSPACE_RESPONSE, UPDATE_WORKSPACE_REQUEST } from '@/services/workspaceServices';
import { RESOURCE_TYPE } from '@/services/resourceServices';

const ResourceItem = ({
  item,
  handleRemove,
  handleEdit
}: {
  item: ResourceItemType;
  handleRemove: () => void;
  handleEdit: () => void;
}) => {
  return (
    <div className='w-80% radius-md grid grid-cols-9 p-3 shadow-md md:grid-cols-11 dark:bg-card'>
      <div className='col-span-7 mt-3 px-5 md:col-span-10 '>
        <div className='border-b  pb-3'>{item.resrc_name}</div>
        <div className='py-2 text-sm text-gray-500'>{item.resrc_url}</div>
      </div>

      <ButtonGroup orientation='vertical' className='col-span-1'>
        <Tooltip label='Edit'>
          <Button variant='subtle' className='w-[30%] p-0' color='gray' onClick={handleEdit}>
            <FaEdit />
          </Button>
        </Tooltip>
        <Tooltip label='Remove'>
          <Button variant='subtle' className='w-[30%] p-0' color='red' onClick={handleRemove}>
            <FaTrash />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default function EditGeneralWorkspaceForm({
  workspace,
  resources
}: {
  workspace: SPECIFIC_WORKSPACE_RESPONSE;
  resources: RESOURCE_TYPE[];
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      wksp_id: workspace?.wksp_id,
      wksp_name: workspace?.wksp_name ?? '',
      wksp_desc: workspace?.wksp_desc ?? ''
    },
    validate: {
      wksp_desc: (value: string) =>
        value.length > 255 ? 'Description should be less than 255 characters' : null,
      wksp_name: (value: string) =>
        value.length > 150 || value.length === 0 ? 'Invalid workspace name' : null
    }
  });
  useEffect(() => {
    if (workspace !== undefined) {
      form.setValues({
        wksp_id: workspace?.wksp_id,
        wksp_name: workspace?.wksp_name,
        wksp_desc: workspace?.wksp_desc ?? ''
      });
    }
  }, [workspace]);
  const handleSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    form.reset();
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
    form.reset();
  };
  const { updateWorkspace } = useUpdateWorkspace(handleSuccess, handleFail);
  const handleSubmit = (value: typeof form.values) => {
    // console.log(value)
    updateWorkspace(value as unknown as UPDATE_WORKSPACE_REQUEST);
  };
  return (
    <div>
      <div className='grid justify-items-center'>
        <form className='w-[80%]' onSubmit={form.onSubmit(handleSubmit)}>
          <h1 className='text-center text-2xl font-semibold uppercase'>Edit Workspace</h1>
          <TextInput
            mt='lg'
            withAsterisk
            required
            label='Workspace Name'
            key={form.key('wksp_name')}
            {...form.getInputProps('wksp_name')}
          />
          <Textarea
            mt='lg'
            inputSize='lg'
            label='Workspace Description'
            {...form.getInputProps('wksp_desc')}
          />
          <Group mt='lg'>
            <Button type='submit' variant='pill'>
              Save
            </Button>
          </Group>
        </form>
      </div>
      <Divider my='sm' />
      <div className='ml-[10%] flex items-center gap-1'>
        <Text className='py-3 text-xl font-semibold'>Resources</Text>
        <Tooltip label='Add resource' color='black' position='right'>
          <Button onClick={() => toggle()} variant='transparent' className='p-0'>
            <FaPlusCircle size={16} />
          </Button>
        </Tooltip>
        <AddResourceForm opened={opened} handleClose={toggle} />
      </div>
      <div className='grid justify-items-center'>
        <div className='w-[90%] '>
          {resources.map((item, index) => (
            <div key={`fg-${index}`} className='px-6 pt-2'>
              <ResourceItem key={index} item={item} handleRemove={() => {}} handleEdit={() => {}} />
              {index + 1 !== resources.length && <Divider my='sm' />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
