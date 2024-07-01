import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FaEdit, FaPlusCircle, FaRegNewspaper, FaTrash } from 'react-icons/fa';

import { useDeleteResource } from '@/libs/hooks/mutations/resourceMutations';
import { useUpdateWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE, NotificationType } from '@/libs/types';
import { ResourceItemType } from '@/libs/types/workspace';
import { useStore } from '@/providers/StoreProvider';
import { RESOURCE_TYPE } from '@/services/resourceServices';
import { SPECIFIC_WORKSPACE_RESPONSE, UPDATE_WORKSPACE_REQUEST } from '@/services/workspaceServices';
import { Button, ButtonGroup, Divider, Group, Text, Textarea, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

import PopoverConfirm from '../popoverConfirm';
import { showErrorToast, showSuccessToast } from '../shared/toast';
import AddResourceForm from './addResourceForm';
import EditResourceForm from './editResourceForm';

const ResourceItem = ({ item, wksp_id }: { item: ResourceItemType; wksp_id: string }) => {
  const { notificationSocket } = useStore((state) => state);
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
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
    deleteResource(
      { wksp_id, resrc_id: item.resrc_id },
      {
        onSuccess: () => {
          notificationSocket.emit(NotificationType.CREATE_SYSTEM_WORKSPACE, {
            noti_tle: 'Update Resource',
            noti_cont: `Resource ${item.resrc_name} has been removed`,
            wksp_id
          });
        }
      }
    );
  };
  const handleCreateResourceBlog = () => {
    router.push(`/blogs/create?wksp_id=${wksp_id}&resrc_id=${item.resrc_id}`);
  };
  return (
    <div className='grid min-w-full grid-cols-9 rounded-lg p-1 shadow-md md:min-w-[80%] md:grid-cols-11 md:p-3 dark:bg-card'>
      <div className='col-span-6 mt-3 truncate px-4 sm:px-5 md:col-span-9 lg:col-span-10 xl:px-5 2xl:px-6'>
        <div className='flex items-center gap-3'>
          <Text truncate='end'>{item.resrc_name}</Text>
          {!item?.blogs && (
            <Tooltip label='Add blog for this resource' withArrow position='right'>
              <Button variant='transparent' className='p-0' color='violet' onClick={handleCreateResourceBlog}>
                <FaRegNewspaper />
              </Button>
            </Tooltip>
          )}
          <Divider />
        </div>
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
  const { notificationSocket } = useStore((state) => state);
  const form = useForm({
    initialValues: {
      wksp_id: workspace?.wksp_id,
      wksp_name: workspace?.wksp_name ?? '',
      wksp_desc: workspace?.wksp_desc ?? ''
    },
    validate: {
      wksp_desc: (value: string) => {
        return value.trim().length == 0
          ? 'Please enter a description'
          : value.split(' ').length > 150
            ? `Description should be less than 150 words! Current length: ${value.split(' ').length} words`
            : null;
      },
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
    showSuccessToast(data.message);
    form.reset();
    return { wksp_id: workspace?.wksp_id };
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
    }
    form.reset();
  };
  const { updateWorkspace, isPending } = useUpdateWorkspace(handleSuccess, handleFail);
  const handleSubmit = (value: typeof form.values) => {
    // console.log(value)
    updateWorkspace(value as unknown as UPDATE_WORKSPACE_REQUEST, {
      onSuccess: () => {
        let content = `Resource ${value.wksp_name} has been updated`;

        if (value.wksp_name !== workspace?.wksp_name) {
          content = `Resource ${value.wksp_name} has been renamed to ${workspace?.wksp_name}`;
        }
        notificationSocket.emit(NotificationType.CREATE_SYSTEM_WORKSPACE, {
          noti_tle: 'Update Resource',
          noti_cont: content,
          wksp_id: workspace?.wksp_id
        });
      }
    });
  };
  return (
    <div>
      <div className='grid justify-items-center'>
        <form className='w-[80%]' onSubmit={form.onSubmit(handleSubmit)}>
          <h1 className='text-center text-2xl font-semibold uppercase'>Edit Workspace</h1>
          <TextInput
            mt='lg'
            withAsterisk
            label='Workspace Name'
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
          <Group mt='lg'>
            <Button type='submit' variant='pill' loading={isPending}>
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
