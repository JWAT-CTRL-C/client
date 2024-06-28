import { AxiosError, isAxiosError } from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { memberAttribute } from '@/libs/constants/memberAttribute';
import {
  useAddMemberToWorkspace,
  useFranchiseWorkspace,
  useRemoveMemberFromWorkspace
} from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE, NotificationType } from '@/libs/types';
import { User } from '@/libs/types/userType';
import { useStore } from '@/providers/StoreProvider';
import { USER_TYPE } from '@/services/userServices';
import { WORKSPACE_MEMBER } from '@/services/workspaceServices';
import {
  Badge,
  Button,
  ComboboxItem,
  Divider,
  Select,
  Table as MTable,
  useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import PopoverConfirm from '../popoverConfirm';

export function WpsMemberTable({
  className,
  member,
  wksp_id,
  currentUser
}: {
  className: string;
  member: WORKSPACE_MEMBER;
  wksp_id: string;
  currentUser: User;
}) {
  const theme = useMantineColorScheme();
  const router = useRouter();
  const { notificationSocket } = useStore((state) => state);

  // Remove member
  const handleRemoveMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    return { wksp_id };
  };
  const handleRemoveMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { removeMember, isPending: removePending } = useRemoveMemberFromWorkspace(
    handleRemoveMemberSuccess,
    handleRemoveMemberFail
  );
  const handleDeleteMember = (user_id: number) => {
    removeMember(
      { wksp_id, user_id },
      {
        onSuccess: () => {
          notificationSocket.emit(NotificationType.CREATE_SYSTEM_WORKSPACE, {
            noti_tle: 'Remove Member',
            noti_cont: `${member.users.find((user) => user.user_id === user_id)?.fuln} has been removed`,
            wksp_id
          });
        }
      }
    );
  };
  const handleConfirmRemoveMember = (user_id: number) => {
    handleDeleteMember(user_id);
  };

  // Franchise
  const handleFranchiseMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    if (member.owner.user_id !== currentUser.user_id && !['MA', 'HM'].includes(currentUser.role))
      router.replace(`/workspaces/${wksp_id}`);
    return { wksp_id };
  };
  const handleFranchiseMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { franchise, isPending: franchisePending } = useFranchiseWorkspace(
    handleFranchiseMemberSuccess,
    handleFranchiseMemberFail
  );
  const handleFranchise = (user_id: number) => {
    franchise(
      { wksp_id, user_id },
      {
        onSuccess: () => {
          notificationSocket.emit(NotificationType.CREATE_SYSTEM_WORKSPACE, {
            noti_tle: 'New Owner',
            noti_cont: `${member.users.find((user) => user.user_id === user_id)?.fuln} has become new owner`,
            wksp_id
          });
        }
      }
    );
  };
  const handleConfirmFranchiseMember = (user_id: number) => {
    handleFranchise(user_id);
  };

  const columnHelper = createColumnHelper<USER_TYPE>();
  const columns = [
    columnHelper.accessor('user_id', {
      cell: (info) => <span>{info.getValue()}</span>,
      header: 'ID',
      id: 'usr_id'
    }),
    columnHelper.accessor('fuln', {
      cell: (info) => info.getValue(),
      header: 'Full Name',
      id: 'fuln',
      size: 300
    }),
    columnHelper.accessor('role', {
      id: 'role',
      cell: (info) => (
        <Badge variant='light' color={memberAttribute[info.getValue()].color} size='sm' radius='md'>
          {memberAttribute[info.getValue()].roleName}
        </Badge>
      ),
      header: 'Role'
    }),
    columnHelper.accessor('role', {
      id: 'franchise',
      header: 'Franchise',
      cell: (info) => {
        return info.getValue() !== 'EM' && info.row.original.user_id !== member?.owner?.user_id ? (
          <PopoverConfirm
            key={info.row.original.user_id}
            title={`Franchise to ${info.row.original.fuln}?`}
            onConfirm={() => handleConfirmFranchiseMember(info.row.original.user_id)}>
            <Button variant='subtle' color='orange' disabled={franchisePending}>
              <FaEdit size={15} />
            </Button>
          </PopoverConfirm>
        ) : null;
      }
    }),
    columnHelper.accessor('role', {
      id: 'actions',
      header: 'Remove',
      cell: (info) => {
        return info.row.original.user_id !== member?.owner?.user_id ? (
          <PopoverConfirm
            key={info.row.original.user_id}
            title='Remove Member'
            onConfirm={() => handleConfirmRemoveMember(info.row.original.user_id)}>
            <Button variant='subtle' color='red' disabled={removePending}>
              <FaTimes size={15} />
            </Button>
          </PopoverConfirm>
        ) : null;
      }
    })
  ];
  const table = useReactTable({
    data: member.users,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <MTable.ScrollContainer className={className} minWidth={100} h={350}>
      <MTable highlightOnHover stickyHeader stickyHeaderOffset={0}>
        <MTable.Thead bg={theme.colorScheme === 'dark' ? 'dark.6' : 'gray.1'}>
          {table.getHeaderGroups().map((headerGroup) => (
            <MTable.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <MTable.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </MTable.Th>
              ))}
            </MTable.Tr>
          ))}
        </MTable.Thead>
        <MTable.Tbody>
          {_.isEmpty(member.users) ? (
            <></>
          ) : (
            table.getRowModel().rows.map((row) => (
              <MTable.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <MTable.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </MTable.Td>
                ))}
              </MTable.Tr>
            ))
          )}
        </MTable.Tbody>
      </MTable>
    </MTable.ScrollContainer>
  );
}

export default function EditWorkspaceMemberForm({
  users,
  members,
  currentUser
}: {
  users: USER_TYPE[];
  members: WORKSPACE_MEMBER;
  currentUser: User;
}) {
  const router = useRouter();
  const [data, setData] = useState<(ComboboxItem & { fuln: string })[]>([]);

  const { notificationSocket } = useStore((state) => state);

  useEffect(() => {
    const listUserData = users.filter(
      (user) => !members.users.map((member) => member.user_id).includes(user.user_id)
    );
    const dropDownData = listUserData.map((user) => ({
      value: user.user_id.toString(),
      label: `${user.fuln} #${user.user_id}`,
      fuln: user.fuln
    }));
    setData(dropDownData);
  }, [members]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      user: null
    },
    validate: {
      user: (value) => (!value ? 'User is required' : null)
    }
  });

  const handleAddMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    form.reset();
    return { wksp_id: router.query.id?.toString() ?? '' };
  };
  const handleAddMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { addMember, isPending } = useAddMemberToWorkspace(handleAddMemberSuccess, handleAddMemberFail);
  const handleSubmit = (value: typeof form.values) => {
    addMember(
      { wksp_id: router.query.id?.toString() ?? '', user_id: parseInt(value.user ?? '') },
      {
        onSuccess: () => {
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
          member={members ?? ({} as WORKSPACE_MEMBER)}
          wksp_id={router.query.id as string}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
