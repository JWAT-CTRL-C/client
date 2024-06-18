import { Button, ButtonGroup, Divider, Group, Text, Textarea, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';
import AddResourceForm from './addResourceForm';
import { ResourceItemType } from '@/libs/types/workspace';
import { useUpdateWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { SPECIFIC_WORKSPACE_RESPONSE, UPDATE_WORKSPACE_REQUEST } from '@/services/workspaceServices';
import { RESOURCE_TYPE } from '@/services/resourceServices';
import EditResourceForm from './editResourceForm';
import { useDeleteResource } from '@/libs/hooks/mutations/resourceMutations';
import { showErrorToast, showSuccessToast } from '../shared/toast';
import PopoverConfirm from '../popoverConfirm';

const ResourceItem = ({ item, wksp_id }: { item: ResourceItemType; wksp_id: string }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const handleSuccess = () => {
    showSuccessToast('Resource is deleted successfully');
    return { wksp_id: wksp_id };
  };
  const handleFail = () => {
    showErrorToast('Fail to remove resource');
  };
  const { deleteResource, isPending } = useDeleteResource(handleSuccess, handleFail);
  const handleEditResource = () => {
    toggle();
  };
  const handleRemoveResource = () => {
    deleteResource({ wksp_id, resrc_id: item.resrc_id });
  };
  return (
    <div className='grid min-w-full grid-cols-9 rounded-lg p-1 shadow-md md:min-w-[80%] md:grid-cols-11 md:p-3 dark:bg-card'>
      <div className='col-span-6 mt-3 truncate px-4 sm:px-5 md:col-span-9 lg:col-span-10 xl:px-5 2xl:px-6'>
        <Text truncate='end' className='border-b pb-3'>
          {item.resrc_name}
        </Text>
        <Text truncate='end' className='py-2 text-sm text-gray-500'>
          {item.resrc_url}
        </Text>
      </div>

      <ButtonGroup orientation='vertical' className={`col-span-3 md:col-span-2 lg:col-span-1`}>
        <Tooltip label='Edit'>
          <Button variant='subtle' className='w-[30%] p-0' color='gray' onClick={() => handleEditResource()}>
            <FaEdit />
          </Button>
        </Tooltip>
        <EditResourceForm data={item} opened={opened} handleClose={toggle} />
        <PopoverConfirm
          key={item.resrc_id}
          title={`Remove resource: ${item.resrc_name}`}
          onConfirm={() => handleRemoveResource()}
          size={350}
          disabled={isPending}>
          <Button
            variant='subtle'
            loading={isPending}
            disabled={isPending}
            className='w-[30%] p-0'
            color='red'>
            <FaTrash />
          </Button>
        </PopoverConfirm>
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
  // useEffect(() => {
  //   if (workspace !== undefined) {
  //     form.setValues({
  //       wksp_id: workspace?.wksp_id,
  //       wksp_name: workspace?.wksp_name,
  //       wksp_desc: workspace?.wksp_desc ?? ''
  //     });
  //   }
  // }, [workspace]);
  const handleSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    form.reset();
    return { wksp_id: workspace?.wksp_id };
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
        <div className='w-[90%]'>
          {resources.map((item, index) => (
            <div key={`fg-${index}`} className='px-6 pt-2'>
              <ResourceItem key={index} item={item} wksp_id={workspace?.wksp_id} />
              {index + 1 !== resources.length && <Divider my='sm' />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
