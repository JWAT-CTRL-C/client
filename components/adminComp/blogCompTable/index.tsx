import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { convertIsoToDateTime, transformBlogTableType } from '@/libs/utils';
import BlogPopover from '@/components/blogPopover';
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
  Badge,
  CopyButton,
  Tooltip,
  ActionIcon,
  rem
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
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp, FaCheck, FaRegCopy } from 'react-icons/fa';

const BlogCompTable = ({
  dataTable,
  onPagination,

  isLoading,
  currentPage
}: {
  dataTable: BlogResponseWithPagination;
  onPagination: (page: number) => void;

  isLoading: boolean;
  currentPage: number;
}) => {
  const [tableValues, setTableValues] = useState<blogTableType[]>([]);
  // hook delete blog:
  const { removeBlog, isPending, isError: isErrorRemoveBlog, errorMessage } = useRemoveBlogById();
  const theme = useMantineTheme();
  const router = useRouter();
  const [activePage, setPage] = useState(currentPage);

  const columns: ColumnDef<blogTableType>[] = [
    {
      accessorKey: 'blog_id',
      header: 'Blog ID',
      size: 50,
      cell: ({ row }) => (
        <Flex align='center' gap={4}>
          <CopyButton value={row.original.blog_id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                  {copied ? <FaCheck style={{ width: rem(16) }} /> : <FaRegCopy style={{ width: rem(16) }} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <TextColumn onClick={handleToBLog} blog_id={row.original.blog_id}>
            {row.original.blog_id}
          </TextColumn>
        </Flex>
      )
    },
    {
      accessorKey: 'blog_tle',
      header: 'Title',
      size: 150,

      cell: ({ row }) => row.original.blog_tle
      // filterFn: (row, columnId, filterValue) => {
      //   return row.original.blog_tle.toLowerCase().includes(filterValue.toLowerCase());
      // }
    },
    {
      accessorKey: 'user',
      header: 'Author',
      cell: ({ row }) => row.original.user.fuln
    },
    {
      accessorKey: 'blog_cmt',
      header: 'Comments',

      cell: ({ row }) => row.original.blog_cmt?.length ?? 0
    },
    {
      accessorKey: 'blog_rtg',
      header: 'Like',

      cell: ({ row }) => (row.original.blog_rtg?.length > 0 ? row.original.blog_rtg?.length : 0)
    },
    {
      accessorKey: 'crd_at',
      header: 'Created At',

      cell: ({ row }) => convertIsoToDateTime(row.original.crd_at as string)
    },
    {
      accessorKey: 'upd_at',
      header: 'Updated At',

      cell: ({ row }) => convertIsoToDateTime(row.original.upd_at as string)
    },
    {
      accessorKey: 'blog_tag',
      header: 'Tags',

      cell: ({ row }) => {
        return (
          <Flex wrap='wrap' align='center' gap='sm'>
            {row.original.blog_tag?.map((tag: Tag) => (
              <Text c={theme.primaryColor} key={tag.tag_id} fw={400}>
                {tag.tag_name}
              </Text>
            ))}
          </Flex>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        return row.original.blog_tag.some((tag: Tag) =>
          tag.tag_name.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    },

    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => (
        <Flex justify='center'>
          <BlogPopover
            isLoading={isPending}
            id={row.original.blog_id}
            onClickEditFunction={handleToEditBlogPage}
            onClickDeleteFunction={handleDeleteBlog}></BlogPopover>
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
      setTableValues(transformBlogTableType(dataTable.data));
    }
  }, [dataTable]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handleToEditBlogPage = (id: string | number) => {
    router.push(`/blogs/${id}/edit`);
  };

  const handleToBLog = (id: string | number) => {
    router.push(`/blogs/${id}`);
  };

  const handleDeleteBlog = (blog_id: string) => {
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
        <Title>Blogs</Title>
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

export default BlogCompTable;
