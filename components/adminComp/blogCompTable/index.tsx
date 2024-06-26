import TextColumn from '@/components/blogTable/textColumn';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
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
  Collapse
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
import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';

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

  const [opened, { toggle }] = useDisclosure(true);

  const columns: ColumnDef<blogTableType>[] = [
    {
      accessorKey: 'blog_id',
      header: 'Blog ID',
      size: 50,

      cell: ({ row }) => (
        <TextColumn onClick={handleToBLog} blog_id={row.original.blog_id}>
          {row.original.blog_id}
        </TextColumn>
      )
    },
    {
      accessorKey: 'blog_tle',
      header: 'Title',
      size: 100,

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

      cell: ({ row }) => convertIsoToDate(row.original.crd_at as string)
    },
    {
      accessorKey: 'upd_at',
      header: 'Updated At',

      cell: ({ row }) => convertIsoToDate(row.original.upd_at as string)
    },
    {
      accessorKey: 'blog_tag',
      header: 'Tags',

      cell: ({ row }) => {
        return (
          <Flex wrap={'wrap'} align='center' gap={'sm'}>
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
        <BlogPopover
          blog_id={row.original.blog_id}
          onClickEditFunction={handleToEditBlogPage}
          onClickDeleteFunction={handleDeleteBlog}></BlogPopover>
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

  const handleDeleteBlog = async (blog_id: string) => {
    try {
      await removeBlog(blog_id);
      showSuccessToast('Delete blog successfully!');
    } catch (error) {
      console.error('Error Delete blog:', error);
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
  };
  const handlePagination = (page: number) => {
    setPage(page);
    onPagination(page);
  };

  return (
    <Group className='flex flex-col py-1'>
      <Flex className='self-start'>
        <Button onClick={toggle}>
          {opened && <FaAngleDown />}
          {!opened && <FaAngleRight />}
          Blogs
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
      {!opened && <Flex justify={'center'}>Click Blogs button to show a list of all blog</Flex>}
    </Group>
  );
};

export default BlogCompTable;
