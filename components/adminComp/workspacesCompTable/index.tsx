import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { useDeleteWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { WorkspacesResponseWithPagination, workspacesType } from '@/libs/types/workspacesType';
import { convertIsoToDate, transformBlogTableType } from '@/libs/utils';
import BlogPopover from '@/pages/blogs/myBlogs/blogPopover';
import {
  Flex,
  useMantineTheme,
  Text,
  Group,
  Title,
  Space,
  Table,
  Loader,
  Pagination,
  Button,
  Collapse,
  Badge
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
    toast.success(data.message);
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      toast.error(err.response?.data.message);
    } else {
      toast.error(err.message);
    }
  };
  const { deleteWorkspace, isPending, isSuccess } = useDeleteWorkspace(handleSuccess, handleFail);
  const theme = useMantineTheme();
  const router = useRouter();
  const [activePage, setPage] = useState(currentPage);

  const [opened, { toggle }] = useDisclosure(false);

  const columns: ColumnDef<workspacesType>[] = [
    {
      accessorKey: 'wksp_id',
      header: 'Workspace ID',
      size: 50,

      cell: ({ row }) => (
        <TextColumn onClick={handleToWorkspace} blog_id={row.original.wksp_id}>
          {row.original.wksp_id}
        </TextColumn>
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

      cell: ({ row }) => convertIsoToDate(row.original.crd_at as string)
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
        <BlogPopover
          blog_id={row.original.wksp_id}
          onClickEditFunction={handleToEditWorkspacePage}
          onClickDeleteFunction={handleDeleteWorkspace}></BlogPopover>
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
      <Flex className='w-full self-start'>
        <Button onClick={toggle} className='w-1/3 lg:w-1/5'>
          {opened && <FaAngleDown />}
          {!opened && <FaAngleRight />}
          Workspaces
        </Button>
      </Flex>
      <Space h='xl' />
      <Collapse in={opened} transitionDuration={500}>
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
      </Collapse>
      {!opened && (
        <Flex justify={'center'} className='w-full'>
          <Badge className='w-full py-4' variant='outline'>
            Click Workspaces button to show a list of all workspace
          </Badge>
        </Flex>
      )}
    </Group>
  );
};

export default WorkspaceCompTable;
