import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCheck, FaRegCopy, FaRegTrashAlt } from 'react-icons/fa';

import BlogPopover from '@/components/blogPopover';
import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { convertIsoToDateTime, transformBlogTableType } from '@/libs/utils';
import {
  ActionIcon,
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
import { Noti, NotificationResponseWithPagination } from '@/libs/types/notiType';
import IconColumn from '@/components/blogTable/iconColumn';
import ShowContent from '@/components/EditorContent';
import { userAttribute } from '@/libs/constants/userAttribute';
import { notificationAttribute } from '@/libs/constants/notiAttribute';

const NotificationCompTable = ({
  dataTable,
  onPagination,

  isLoading,
  currentPage
}: {
  dataTable: NotificationResponseWithPagination;
  onPagination: (page: number) => void;

  isLoading: boolean;
  currentPage: number;
}) => {
  const [tableValues, setTableValues] = useState<Noti[]>([]);
  // hook delete blog:
  const { removeBlog, isPending, isError: isErrorRemoveBlog, errorMessage } = useRemoveBlogById();
  const theme = useMantineTheme();
  const router = useRouter();
  const [activePage, setPage] = useState(currentPage);

  const columns: ColumnDef<Noti>[] = [
    {
      accessorKey: 'noti_id',
      header: 'Notification ID',

      cell: ({ row }) => (
        <Flex align='center' gap={4} wrap={'no-wrap'} className='w-[90%]'>
          <CopyButton value={row.original.noti_id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                  {copied ? <FaCheck style={{ width: rem(16) }} /> : <FaRegCopy style={{ width: rem(16) }} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Text lineClamp={1}>{row.original.noti_id}</Text>
        </Flex>
      )
    },
    {
      accessorKey: 'noti_cont',
      header: 'Content',
      size: 300,

      cell: ({ row }) => <ShowContent className='line-clamp-2' content={row.original.noti_cont} />
      // filterFn: (row, columnId, filterValue) => {
      //   return row.original.blog_tle.toLowerCase().includes(filterValue.toLowerCase());
      // }
    },
    {
      accessorKey: 'user',
      header: 'Author',
      cell: ({ row }) => (row.original.user ? row.original.user.fuln : 'System')
    },

    {
      accessorKey: 'crd_at',
      header: 'Created At',

      cell: ({ row }) => convertIsoToDateTime(row.original.crd_at as string)
    },

    // {
    //   accessorKey: 'is_read',
    //   header: 'Is Read',
    //   size: 300,

    //   cell: ({ row }) => {
    //     const isRead = row.original.is_read ? 'read' : 'unread';
    //     return (
    //       <Badge variant='light' color={notificationAttribute[isRead].color} size='sm' radius='md'>
    //         {notificationAttribute[isRead].status}
    //       </Badge>
    //     );
    //   }
    // },

    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => (
        <Flex justify='center'>
          <Tooltip label='Delete'>
            <div>
              <IconColumn isRed={true} blog_id={row.original.noti_id} onClick={handleDelete}>
                <FaRegTrashAlt />
              </IconColumn>
            </div>
          </Tooltip>
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

  const handleDelete = (blog_id: string) => {
    removeBlog(blog_id, {
      onSuccess: () => {
        showSuccessToast('Delete blog successfully!');
      },
      onError: (error) => {
        showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      }
    });
  };
  const handlePagination = (page: number) => {
    setPage(page);
    onPagination(page);
  };

  return (
    <Group className='flex flex-col py-1'>
      <Flex className='w-full self-start'>
        <Title>Notifications</Title>
      </Flex>
      <Space h='xl' />

      <Table
        className='w-full overflow-x-auto'
        horizontalSpacing='md'
        verticalSpacing='md'
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders>
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

export default NotificationCompTable;
