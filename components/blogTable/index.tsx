import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCheck, FaRegCopy, FaSearch } from 'react-icons/fa';

import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { convertIsoToDateTime, transformBlogTableType } from '@/libs/utils';
import {
  ActionIcon,
  CopyButton,
  Flex,
  Group,
  Input,
  Loader,
  Pagination,
  Space,
  Table,
  Text,
  Title,
  Tooltip,
  rem,
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

import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import BlogPopover from '@/components/blogPopover';
import { showErrorToast, showSuccessToast } from '../shared/toast';
import TextColumn from './textColumn';

const BlogTable = ({
  dataTable,
  onPagination,
  onSearch,
  isLoading,
  currentPage
}: {
  dataTable: BlogResponseWithPagination;
  onPagination: (page: number) => void;
  onSearch: (title: string) => void;
  isLoading: boolean;
  currentPage: number;
}) => {
  const [filterField, setFilterField] = useState('');
  const [tableValues, setTableValues] = useState<blogTableType[]>([]);
  // hook delete blog:
  const { removeBlog, isPending, isError: isErrorRemoveBlog, errorMessage } = useRemoveBlogById();
  const theme = useMantineTheme();
  const router = useRouter();
  const [activePage, setPage] = useState(currentPage);

  // Call hook to fetch filtered blogs
  //const { data: filteredBlogs, isLoading, isError } = useFetchBlogsCurrentUserByTitle(filterField.trim());

  //let transformedBlogs = filteredBlogs ? transformBlogTableType(filteredBlogs) : [];

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
      size: 100,

      cell: ({ row }) => row.original.blog_tle
      // filterFn: (row, columnId, filterValue) => {
      //   return row.original.blog_tle.toLowerCase().includes(filterValue.toLowerCase());
      // }
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
          id={row.original.blog_id}
          onClickEditFunction={handleToEditBlogPage}
          onClickDeleteFunction={handleDeleteBlogPage}></BlogPopover>
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

  const handleSetFilterField = (value: string) => {
    setFilterField(value);
    onSearch(value);
  };

  const handleToEditBlogPage = (id: string | number) => {
    router.push(`/blogs/${id}/edit`);
  };

  const handleToBLog = (id: string | number) => {
    router.push(`/blogs/${id}`);
  };

  const handleDeleteBlogPage = (blog_id: string) => {
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
    <Group className='py-3'>
      <Flex
        className={`flex flex-col gap-5`}
        style={{
          width: `${table.getCenterTotalSize()}px`
        }}>
        <Title>My Blogs</Title>

        <Input
          className='w-1/2'
          placeholder='Filter title...'
          value={filterField}
          onChange={(event) => handleSetFilterField(event.currentTarget.value)}
          rightSection={<FaSearch onClick={() => handleSetFilterField('')} />}
        />
      </Flex>
      <Space h='xl' />
      <Table
        className='w-full overflow-x-auto'
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
      <Flex className='w-full justify-start lg:justify-center'>
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

export default BlogTable;
