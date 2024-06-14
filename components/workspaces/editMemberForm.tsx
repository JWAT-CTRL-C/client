import {
  Badge,
  Button,
  Divider,
  Loader,
  Table as MTable,
  ComboboxItem,
  useMantineColorScheme,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaUserPlus } from 'react-icons/fa';
import _ from 'lodash';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useGetAllUsers } from '@/libs/hooks/queries/userQueries';
import { useGetWorkspaceMember } from '@/libs/hooks/queries/workspaceQueries';
import { useRouter } from 'next/router';
import { useRouter as useNavRouter } from 'next/navigation';
import { USER_TYPE } from '@/services/userServices';
import {
  useAddMemberToWorkspace,
  useFranchiseWorkspace,
  useRemoveMemberFromWorkspace
} from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import PopoverConfirm from '../popoverConfirm';
import { WORKSPACE_MEMBER } from '@/services/workspaceServices';

export function WpsMemberTable({
  className,
  member,
  wksp_id
}: {
  className: string;
  member: WORKSPACE_MEMBER;
  wksp_id: string;
}) {
  const theme = useMantineColorScheme();
  const navRouter = useNavRouter();
  // table config
  const memeberAttribute = {
    HM: { color: 'red', roleName: 'Head Master' },
    MA: { color: 'red', roleName: 'Head Master' },
    PM: { color: 'orange', roleName: 'Project Manager' },
    EM: { color: 'rgba(255, 255, 255, 0)', roleName: 'Employee' }
  };
  // Remove member
  const handleRemoveMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
  };
  const handleRemoveMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { removeMember } = useRemoveMemberFromWorkspace(handleRemoveMemberSuccess, handleRemoveMemberFail);
  const handleDeleteMember = (user_id: number) => {
    removeMember({ wksp_id, user_id });
  };
  const handleConfirmRemoveMember = (user_id: number) => {
    handleDeleteMember(user_id);
  };

  // Franchise
  const handleFranchiseMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    navRouter.replace(`/workspaces/${wksp_id}`);
  };
  const handleFranchiseMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { franchise } = useFranchiseWorkspace(handleFranchiseMemberSuccess, handleFranchiseMemberFail);
  const handleFranchise = (user_id: number) => {
    franchise({ wksp_id, user_id });
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
        <Badge variant='light' color={memeberAttribute[info.getValue()].color} size='sm' radius='md'>
          {memeberAttribute[info.getValue()].roleName}
        </Badge>
      ),
      header: 'Role'
    }),
    columnHelper.accessor('role', {
      id: 'franchies',
      header: 'Franchise',
      cell: (info) => {
        return info.getValue() !== 'EM' && info.row.original.user_id !== member.owner.user_id ? (
          <PopoverConfirm
            key={info.row.original.user_id}
            title={`Franchise to ${info.row.original.fuln}?`}
            handleConfirm={() => handleConfirmFranchiseMember(info.row.original.user_id)}>
            <Button variant='subtle' color='orange'>
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
        return (
          <PopoverConfirm
            key={info.row.original.user_id}
            title='Remove Member'
            handleConfirm={() => handleConfirmRemoveMember(info.row.original.user_id)}>
            <Button variant='subtle' color='red'>
              <FaTimes size={15} />
            </Button>
          </PopoverConfirm>
        );
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
          {table.getRowModel().rows.map((row) => (
            <MTable.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <MTable.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </MTable.Td>
              ))}
            </MTable.Tr>
          ))}
        </MTable.Tbody>
      </MTable>
    </MTable.ScrollContainer>
  );
}

export default function EditWorkspaceMemberForm() {
  const router = useRouter();
  const { users } = useGetAllUsers();
  const { members } = useGetWorkspaceMember(router.query.id as string);
  const [data, setData] = useState<ComboboxItem[]>([]);
  useEffect(() => {
    const dropDownData = (users ?? []).map((user) => ({
      value: user.user_id.toString(),
      label: `${user.fuln} #${user.user_id}`
    }));
    setData(dropDownData);
  }, [users]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      user: ''
    }
  });

  const handleAddMemberSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    toast.success(data.message);
    form.reset();
  };
  const handleAddMemberFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
    form.reset();
  };
  const { addMember } = useAddMemberToWorkspace(handleAddMemberSuccess, handleAddMemberFail);
  const handleSubmit = (value: typeof form.values) => {
    addMember({ wksp_id: router.query.id?.toString() ?? '', user_id: parseInt(value.user) });
  };

  return (
    <div className='max-h-[90vh] px-[8%]'>
      <form className='py-3' onSubmit={form.onSubmit(handleSubmit)}>
        <h1 className='text-center text-2xl font-semibold uppercase'>Edit Workspace's Members</h1>
        <Select
          leftSection={<FaUserPlus />}
          mt='lg'
          label='Invite Members'
          data={data}
          searchable
          {...form.getInputProps('user')}
        />
        <Button type='submit' mt='lg'>
          Save
        </Button>
      </form>
      <Divider my='xs' label='Members list' labelPosition='left' />
      <div className='max-h-96 overflow-y-auto '>
        <WpsMemberTable
          className='max-h-96'
          member={members ?? ({} as WORKSPACE_MEMBER)}
          wksp_id={router.query.id as string}
        />
      </div>
    </div>
  );
}
