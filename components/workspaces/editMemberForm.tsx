import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Divider,
  List,
  Loader,
  MultiSelect,
  rem,
  Table as MTable,
  Tooltip,
  ComboboxItem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState } from 'react';
import { FaCheck, FaRegCopy, FaTimes, FaUserPlus } from 'react-icons/fa';
import _ from 'lodash';
import { WorkspaceMemberInputType, WorkspaceMemberType } from '@/libs/types/workspace';
import { createColumnHelper, flexRender, getCoreRowModel, Table, useReactTable } from '@tanstack/react-table';
import { cn } from '@/libs/utils';

export function WpsMemberTable({ className, member }: { className: string; member: WorkspaceMemberType[] }) {
  // table config
  const memeberAttribute = {
    HM: { color: 'red', roleName: 'Head Master' },
    PM: { color: 'orange', roleName: 'Project Manager' },
    EM: { color: 'rgba(255, 255, 255, 0)', roleName: 'Employee' }
  };
  const handleDeleteMember = (user_id: number) => {
    console.log(user_id);
  };
  const columnHelper = createColumnHelper<WorkspaceMemberType>();
  const columns = [
    columnHelper.accessor('usr_id', {
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
      id: 'actions',
      header: 'Remove',
      cell: (info) => {
        return (
          <>
            {info.getValue() !== 'HM' && (
              <Button
                onClick={() => handleDeleteMember(info.row.original.usr_id)}
                variant='transparent'
                color='red'>
                <FaTimes size={15} />
              </Button>
            )}
          </>
        );
      }
    })
  ];
  const table = useReactTable({
    data: member,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <MTable.ScrollContainer className={className} minWidth={100} h={300}>
      <MTable highlightOnHover stickyHeader stickyHeaderOffset={0}>
        <MTable.Thead>
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
  const members: WorkspaceMemberType[] = [
    {
      usr_id: 1,
      usrn: 'john',
      fuln: 'John Doe',
      role: 'HM'
    },
    {
      usr_id: 2,
      usrn: 'jane',
      fuln: 'Jane Smith',
      role: 'PM'
    },
    {
      usr_id: 3,
      usrn: 'bob',
      fuln: 'Bob Johnson',
      role: 'EM'
    },
    {
      usr_id: 4,
      usrn: 'sarah',
      fuln: 'Sarah Lee',
      role: 'EM'
    },
    {
      usr_id: 5,
      usrn: 'mike',
      fuln: 'Mike Wilson',
      role: 'EM'
    },
    {
      usr_id: 6,
      usrn: 'lisa',
      fuln: 'Lisa Chen',
      role: 'EM'
    }
  ];
  const [data, setData] = useState<ComboboxItem[]>([
    { value: "0", label: 'Head Master' },
    { value: "1", label: 'Project Manager' },
    { value: "2", label: 'Employee' }
  ]);
  const form = useForm({
    initialValues: {
      values: []
    }
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = useDebouncedCallback(async (query: string) => {
    // setLoading(true);
    // setData([]);
    console.log('debounce', query);
    // setLoading(false);
  }, 1000);

  const handleSearchChange = (value: string) => {
    console.log('search', value);
    if (value.length > 0) {
      const trimmedValue = value.trim();
      //   setSearch(trimmedValue);
      handleSearch(trimmedValue);
    }
  };
  const handleSubmit = (value: typeof form.values) => {
    console.log('submit', value);
  };

  return (
    <div>
      <form className='p-5' onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <h1 className='text-center text-2xl font-semibold'>Edit Workspace's Members</h1>
        <MultiSelect
          leftSection={<FaUserPlus />}
          rightSection={loading && <Loader size={20} />}
          mt='lg'
          label='Invite Members'
          data={data}
          searchable
          onSearchChange={(value) => handleSearchChange(value)}
          {...form.getInputProps('values')}
        />
        <Button type='submit' fullWidth mt='lg'>
          Save
        </Button>
      </form>
      <Divider my='xs' label='Members list' labelPosition='left' />
      <div className='max-h-96 overflow-y-auto '>
        <WpsMemberTable className='max-h-96' member={members} />
      </div>
    </div>
  );
}
