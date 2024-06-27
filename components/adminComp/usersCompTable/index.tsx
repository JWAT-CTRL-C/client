import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { memberAttribute } from '@/libs/constants/memberAttribute';
import { userAttribute } from '@/libs/constants/userAttribute';
import { useRemoveUser, useRestoreUser } from '@/libs/hooks/mutations/userMutations';
import { User, UserResponseWithPagination } from '@/libs/types/userType';
import { convertIsoToDateTime } from '@/libs/utils';
import BlogPopover from '@/pages/blogs/myBlogs/blogPopover';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  Pagination,
  Space,
  Table,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import FormModalAdmin from '../formModal';

const UserCompTable = ({
  dataTable,
  onPagination,
  isLoading,
  currentPage
}: {
  dataTable: UserResponseWithPagination;
  onPagination: (page: number) => void;

  isLoading: boolean;
  currentPage: number;
}) => {
  const [tableValues, setTableValues] = useState<User[]>([]);

  const { removeUser, isPending: isPendingRemoveUser } = useRemoveUser();
  const { restoreUser, isPending: isPendingRestoreUser } = useRestoreUser();

  const theme = useMantineTheme();

  const [activePage, setPage] = useState(currentPage);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'user_id',
      header: 'User ID',
      size: 50,

      cell: ({ row }) => (
        <TextColumn onClick={handleToUserInfo} blog_id={row.original.user_id}>
          {row.original.user_id}
        </TextColumn>
      )
    },
    {
      accessorKey: 'usrn',
      header: 'Username',
      size: 150,

      cell: ({ row }) => (
        <Flex align={'center'} gap={'lg'}>
          <Avatar src={row.original.avatar} />
          <Text>{row.original.usrn}</Text>
        </Flex>
      )
    },
    {
      accessorKey: 'fuln',
      header: 'Full name',

      cell: ({ row }) => row.original.fuln
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 150,

      cell: ({ row }) => row.original.email
    },

    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => row.original.phone ?? ''
    },
    {
      accessorKey: 'role',
      header: 'Role',

      cell: ({ row }) => (
        <Badge variant='light' color={memberAttribute[row.original.role].color} size='sm' radius='md'>
          {memberAttribute[row.original.role].roleName}
        </Badge>
      )
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',

      cell: ({ row }) => {
        const isActive = row.original.deleted_at ? 'inactive' : 'active';

        return (
          <Badge variant='light' color={userAttribute[isActive].color} size='sm' radius='md'>
            {userAttribute[isActive].status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'crd_at',
      header: 'Created At',

      cell: ({ row }) => convertIsoToDateTime(row.original.crd_at as string)
    },

    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => (
        <Flex justify='center'>
          <BlogPopover
            isLoading={isLoading}
            user={row.original}
            id={row.original.user_id.toString()}
            onClickEditFunction={handleToEdit}
            onClickDeleteFunction={handleDelete}
            onClickRestore={handleRestore}></BlogPopover>
        </Flex>
      )
    }
  ];

  const table = useReactTable({
    data: tableValues,

    columns,
    state: {
      // columnFilters
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()

    // onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    if (dataTable?.data) {
      setTableValues(dataTable.data);
    }
  }, [dataTable]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handleToEdit = (id: string | number) => {
    //router.push(`/blogs/${id}/edit`);
  };

  const handleToUserInfo = (id: string | number) => {
    //router.push(`/blogs/${id}`);
  };

  const handleRestore = async (id: string | number) => {
    await restoreUser(id as number, {
      onError: (error) => {
        showErrorToast(error.message);
      },
      onSuccess: () => {
        showSuccessToast('Restore user successfully');
      }
    });
  };

  const handleDelete = async (id: string | number) => {
    await removeUser(id as number, {
      onError: (error) => {
        showErrorToast(error.message);
      },
      onSuccess: () => {
        showSuccessToast('Delete user successfully');
      }
    });
  };
  const handlePagination = (page: number) => {
    setPage(page);
    onPagination(page);
  };

  return (
    <Group className='flex flex-col py-1'>
      <Flex className='w-full items-center justify-between self-start'>
        <Title>USERS</Title>
        <div className='justify-self-end'>
          <FormModalAdmin />
        </div>
      </Flex>
      <Space h='xl' />

      <Table
        // style={{
        //   width: `${table.getCenterTotalSize()}px`
        // }}
        className='overflow-x-auto'
        horizontalSpacing='md'
        verticalSpacing='md'
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        stickyHeader
        stickyHeaderOffset={60}>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id} c={theme.primaryColor} fw={'bolder'} className='group relative'>
                  {header.isPlaceholder ? null : (
                    <div className='my-1'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className='text-center'>
                <Loader c={theme.primaryColor} />
              </Table.Td>
            </Table.Tr>
          ) : table?.getRowModel()?.rows?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className='text-center'>
                <Text c={theme.primaryColor} fw={'bold'}>
                  Not Found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    <Text size='sm' lineClamp={2}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
      <Flex className='mt-5 w-full justify-start lg:justify-center'>
        <Pagination value={activePage} onChange={handlePagination} total={dataTable?.totalPages} />
      </Flex>
    </Group>
  );
};

export default UserCompTable;
