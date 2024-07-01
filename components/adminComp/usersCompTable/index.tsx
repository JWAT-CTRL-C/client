import { useEffect, useState } from 'react';
import { FaCheck, FaRegCopy, FaUserShield } from 'react-icons/fa';

import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { memberAttribute } from '@/libs/constants/memberAttribute';
import { userAttribute } from '@/libs/constants/userAttribute';
import { useRemoveUser, useResetPassword, useRestoreUser } from '@/libs/hooks/mutations/userMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { ErrorResponseType } from '@/libs/types';
import { User, UserResponseWithPagination } from '@/libs/types/userType';
import { convertIsoToDateTime } from '@/libs/utils';
import {
  ActionIcon,
  Avatar,
  Badge,
  CopyButton,
  Flex,
  Group,
  Loader,
  Pagination,
  rem,
  Space,
  Table,
  Text,
  Title,
  Tooltip,
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

import AdminPopover from '../adminPopOver';
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
  const { resetPassword, isPending: isPendingResetPassword } = useResetPassword();
  const { user: userInfo } = useMyInfo();

  const theme = useMantineTheme();

  const [activePage, setPage] = useState(currentPage);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'user_id',
      header: 'User ID',
      size: 50,

      cell: ({ row }) => (
        <Flex align='center' gap={4}>
          <CopyButton value={row.original.user_id.toString()} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                  {copied ? <FaCheck style={{ width: rem(16) }} /> : <FaRegCopy style={{ width: rem(16) }} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <TextColumn onClick={handleToUserInfo} blog_id={row.original.user_id}>
            {row.original.user_id}
          </TextColumn>
        </Flex>
      )
    },
    {
      accessorKey: 'usrn',
      header: 'Username',
      size: 150,

      cell: ({ row }) => (
        <Flex align='center' gap='lg'>
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
          {userInfo?.role !== row.original.role && (
            <AdminPopover
              user={row.original}
              id={row.original.user_id.toString()}
              onClickDeleteFunction={handleDelete}
              onClickRestore={handleRestore}
              onClickReset={handleResetPassword}
            />
          )}
          {userInfo?.role === row.original.role && (
            <ActionIcon disabled className='cursor-not-allowed text-2xl' bg='transparent'>
              <FaUserShield />
            </ActionIcon>
          )}
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

  const handleToEdit = (id: string | number) => {};

  const handleToUserInfo = (id: string | number) => {};

  const handleRestore = (id: string | number) => {
    restoreUser(id as number, {
      onSuccess: () => {
        showSuccessToast('Restore user successfully');
      },
      onError: (error) => {
        const message = (error as ErrorResponseType).response.data.message;
        showErrorToast(`${Array.isArray(message) ? message.join('\n') : message}`);
      }
    });
  };

  const handleDelete = (id: string | number) => {
    removeUser(id as number, {
      onSuccess: () => {
        showSuccessToast('Delete user successfully');
      },
      onError: (error) => {
        const message = (error as ErrorResponseType).response.data.message;
        showErrorToast(`${Array.isArray(message) ? message.join('\n') : message}`);
      }
    });
  };

  const handleResetPassword = (id: string | number) => {
    resetPassword(id as number, {
      onSuccess: () => {
        showSuccessToast('Reset password successfully');
      },
      onError: (error) => {
        const message = (error as ErrorResponseType).response.data.message;
        showErrorToast(`${Array.isArray(message) ? message.join('\n') : message}`);
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

      {/* <ScrollArea h={500} scrollHideDelay={500} offsetScrollbars scrollbarSize={4} className='mx-10'> */}
      <Table
        horizontalSpacing='md'
        verticalSpacing='md'
        striped
        className='h-full'
        highlightOnHover
        withTableBorder
        withColumnBorders
        // stickyHeader
        // stickyHeaderOffset={0}
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id} c={theme.primaryColor} fw='bolder' className='group'>
                  {header.isPlaceholder ? null : (
                    <div className='my-1 text-center'>
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
                <Text c={theme.primaryColor} fw='bold'>
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
      {/* </ScrollArea> */}
      <Flex className='mt-5 w-full justify-start lg:justify-center'>
        <Pagination
          size='sm'
          radius='lg'
          value={activePage}
          onChange={handlePagination}
          total={dataTable?.totalPages}
        />
      </Flex>
    </Group>
  );
};

export default UserCompTable;
