import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa';

import BlogPopover from '@/components/blogPopover';
import TextColumn from '@/components/blogTable/textColumn';
import { useDeleteWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { WorkspacesResponseWithPagination, workspacesType } from '@/libs/types/workspacesType';
import { convertIsoToDateTime } from '@/libs/utils';
import {
  ActionIcon,
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
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';

const WorkspaceCompTable = ({
  dataTable,
  onPagination,

  isLoading,
  currentPage
}: {
  dataTable: WorkspacesResponseWithPagination;
  onPagination: (page: number) => void;

  isLoading: boolean;
  currentPage: number;
}) => {
  const [tableValues, setTableValues] = useState<workspacesType[]>([]);
  const handleSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    showSuccessToast(data.message);
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
    }
  };
  const { deleteWorkspace, isPending, isSuccess } = useDeleteWorkspace(handleSuccess, handleFail);
  const theme = useMantineTheme();
  const router = useRouter();
  const [activePage, setPage] = useState(currentPage);

  const columns: ColumnDef<workspacesType>[] = [
    {
      accessorKey: 'wksp_id',
      header: 'Workspace ID',
      size: 50,

      cell: ({ row }) => (
        <Flex align='center' gap={4}>
          <CopyButton value={row.original.wksp_id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                  {copied ? <FaCheck style={{ width: rem(16) }} /> : <FaRegCopy style={{ width: rem(16) }} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <TextColumn onClick={handleToWorkspace} blog_id={row.original.wksp_id}>
            {row.original.wksp_id}
          </TextColumn>
        </Flex>
      )
    },
    {
      accessorKey: 'wksp_name',
      header: 'Name',
      size: 150,

      cell: ({ row }) => row.original.wksp_name
    },
    {
      accessorKey: 'wksp_desc',
      header: 'Description',
      cell: ({ row }) => row.original.wksp_desc
    },
    {
      accessorKey: 'users',
      header: 'Total member',

      cell: ({ row }) => row.original.users?.length ?? 0
    },
    {
      accessorKey: 'resources',
      header: 'Total resources',

      cell: ({ row }) => (row.original.resources?.length > 0 ? row.original.resources?.length : 0)
    },
    {
      accessorKey: 'crd_at',
      header: 'Created At',

      cell: ({ row }) => convertIsoToDateTime(row.original.crd_at as string)
    },

    {
      accessorKey: 'owner',
      header: 'Owner',

      cell: ({ row }) => {
        return <Text>{row.original.owner?.usrn}</Text>;
      }
    },

    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => (
        <Flex justify='center'>
          <BlogPopover
            id={row.original.wksp_id}
            onClickEditFunction={handleToEditWorkspacePage}
            onClickDeleteFunction={handleDeleteWorkspace}></BlogPopover>
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

  const handleToEditWorkspacePage = (id: string | number) => {
    router.push(`/workspaces/${id}/edit`);
  };

  const handleToWorkspace = (id: string | number) => {
    router.push(`/workspaces/${id}`);
  };

  const handleDeleteWorkspace = async (wksp_id: string) => {
    deleteWorkspace(wksp_id);
  };
  const handlePagination = (page: number) => {
    setPage(page);
    onPagination(page);
  };

  return (
    <Group className='flex flex-col py-1'>
      <Flex className='w-full'>
        <Title>Workspaces</Title>
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
        // stickyHeader
        // stickyHeaderOffset={60}
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id} c={theme.primaryColor} fw='bolder' className='group relative'>
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

export default WorkspaceCompTable;
