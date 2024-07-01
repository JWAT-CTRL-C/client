import { AxiosError, isAxiosError } from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

import { useAddMemberToWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { useGetAllUsers, useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useGetWorkspaceMember } from '@/libs/hooks/queries/workspaceQueries';
import { GENERAL_RESPONSE_TYPE, NotificationType } from '@/libs/types';
import { useStore } from '@/providers/StoreProvider';
import { Button, ComboboxItem, Divider, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

import { showErrorToast, showSuccessToast } from '../shared/toast';
import WpsMemberTable from './WpsMemberTable';

export default function EditWorkspaceMemberForm({ wksp_id }: { wksp_id: string }) {
  const router = useRouter();
  const [data, setData] = useState<(ComboboxItem & { fuln: string })[]>([]);

  const { user } = useMyInfo();
  const { users } = useGetAllUsers();
  const { members } = useGetWorkspaceMember(wksp_id);

  const { notificationSocket } = useStore((state) => state);

  useEffect(() => {
    if (!_.isNil(members) && members.owner.user_id !== user.user_id && !['MA', 'HM'].includes(user.role)) {
      router.replace(`/workspaces/${router.query.id}`);
    }
    const listUserData = users.filter(
      (user) => !members.users.map((member) => member.user_id).includes(user.user_id)
    );
    const dropDownData = listUserData.map((user) => ({
      value: user.user_id.toString(),
      label: `${user.fuln} #${user.user_id}`,
      fuln: user.fuln
    }));
    setData(dropDownData);
  }, [members, users]);
  const form = useForm({
    initialValues: {
      user: null
    },
    validate: {
      user: (value) => (!value ? 'User is required' : null)
    }
  });

  const handleAddMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    showSuccessToast(data.message);
    form.reset();
    return { wksp_id: router.query.id?.toString() ?? '' };
  };
  const handleAddMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
    }
  };
  const { addMember, isPending } = useAddMemberToWorkspace(handleAddMemberSuccess, handleAddMemberFail);
  const handleSubmit = (value: typeof form.values) => {
    addMember(
      { wksp_id: router.query.id as string, user_id: parseInt(value.user ?? '') },
      {
        onSuccess: () => {
          form.setValues({ user: null });
          notificationSocket.emit(NotificationType.CREATE_SYSTEM_WORKSPACE, {
            noti_tle: 'New Member',
            noti_cont: `${data.find((user) => user.value === value.user)?.fuln} has been added`,
            wksp_id: router.query.id?.toString() ?? ''
          });
        }
      }
    );
  };
  return (
    <div className='max-h-[90vh] px-[8%]'>
      <form className='py-3' onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className='text-center text-2xl font-semibold uppercase'>Edit Workspace&apos;s Members</h1>
        <Select
          leftSection={<FaUserPlus />}
          mt='lg'
          label='Invite a member'
          data={data}
          searchable
          withAsterisk
          clearable
          nothingFoundMessage='No member available'
          {...form.getInputProps('user')}
        />
        <Button type='submit' mt='lg' disabled={_.isEmpty(data)} loading={isPending}>
          Save
        </Button>
      </form>
      <Divider my='xs' label='Members list' labelPosition='left' />
      <div className='max-h-96 overflow-y-auto'>
        <WpsMemberTable
          className='max-h-96'
          member={members}
          wksp_id={router.query.id as string}
          currentUser={user}
        />
      </div>
    </div>
  );
}
