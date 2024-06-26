import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt, FaSearch } from 'react-icons/fa';

import { useRemoveBlogById } from '@/libs/hooks/mutations/blogMutations';
import { useFetchBlogsCurrentUserByTitle } from '@/libs/hooks/queries/blogQueries';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { convertIsoToDate, transformBlogTableType } from '@/libs/utils';
import {
  Flex,
  Group,
  Input,
  Loader,
  LoadingOverlay,
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

import { showErrorToast, showSuccessToast } from '../shared/toast';
import IconColumn from './iconColumn';
import TextColumn from './textColumn';
import BlogPopover from '@/pages/blogs/myBlogs/blogPopover';

const BlogTable = ({ dataTable }: { dataTable: blogTableType[] }) => {
  const [filterField, setFilterField] = useState('');
  // const [filterByTag, setFilterByTag] = useState<Tag | null>(null);
  const [tableValues, setTableValues] = useState<blogTableType[]>(dataTable);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // hook delete blog:
  const { removeBlog, isPending, isError: isErrorRemoveBlog, errorMessage } = useRemoveBlogById();
  const theme = useMantineTheme();
  const router = useRouter();

  // Call hook to fetch filtered blogs
  const { data: filteredBlogs, isLoading, isError } = useFetchBlogsCurrentUserByTitle(filterField.trim());

  let transformedBlogs = filteredBlogs ? transformBlogTableType(filteredBlogs) : [];
  let displayData = filterField ? transformedBlogs : dataTable;

  // fix : duplicate select field
  // const allTagsSet = new Set<Tag>();

  // dataTable.forEach((blog) => {
  //   blog.blog_tag.forEach((tag) => {
  //     allTagsSet.add(tag);
  //   });
  // });

  // const allTags = Array.from(allTagsSet);
  // const tagOptions = allTags.map((tag) => ({ value: tag.tag_id.toString(), label: tag.tag_name }));
  const columns: ColumnDef<blogTableType>[] = [
    {
      accessorKey: 'blog_id',
      header: 'Blog ID',

      cell: ({ row }) => (
        <TextColumn onClick={handleToBLog} blog_id={row.original.blog_id}>
          {row.original.blog_id}
        </TextColumn>
      )
    },
    {
      accessorKey: 'blog_tle',
      header: 'Title',

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
    let transformedBlogs = filteredBlogs ? transformBlogTableType(filteredBlogs) : [];
    let displayData = filterField ? transformedBlogs : dataTable;
    setTableValues(displayData);
  }, [filterField, dataTable, tableValues]);

  const handleSetFilterField = (value: string) => {
    setFilterField(value);
    // setColumnFilters([{ id: 'blog_tle', value }]);
  };

  // const handleSetFilterByTag = (tag_id: string | null) => {
  //   // if (tag_id === null) {
  //   //   setFilterByTag(null);
  //   //   setColumnFilters((prev) => [
  //   //     ...prev.filter((filter) => filter.id !== 'blog_tag'),
  //   //     { id: 'blog_tag', value: '' }
  //   //   ]);
  //   // } else {
  //   //   const selectedTag = allTags.find((tag) => tag.tag_id.toString() === tag_id);
  //   //   setFilterByTag(selectedTag || null);
  //   //   const tagName = selectedTag ? selectedTag.tag_name : '';
  //   //   setColumnFilters((prev) => [
  //   //     ...prev.filter((filter) => filter.id !== 'blog_tag'),
  //   //     { id: 'blog_tag', value: tagName }
  //   //   ]);
  //   // }
  // };

  const handleToEditBlogPage = (id: string | number) => {
    router.push(`/blogs/${id}/edit`);
  };

  const handleToBLog = (id: string | number) => {
    router.push(`/blogs/${id}`);
  };

  const handleDeleteBlogPage = async (blog_id: string) => {
    try {
      await removeBlog(blog_id);
      showSuccessToast('Delete blog successfully!');
    } catch (error) {
      console.error('Error Delete blog:', error);
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
  };

  if (isPending)
    return <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <Group>
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
        {/* <Select
            placeholder='Filter by tag...'
            data={tagOptions}
            clearable
            checkIconPosition='right'
            value={filterByTag ? filterByTag.tag_id.toString() : null}
            onChange={(value) => handleSetFilterByTag(value)}
          /> */}
      </Flex>
      <Space h='xl' />
      <Table
        style={{
          width: `${table.getCenterTotalSize()}px`
        }}
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
          {table.getRowModel().rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className='text-center'>
                {tableValues.length === 0 && !isLoading && (
                  <Text c={theme.primaryColor} fw={'bold'}>
                    Not Found
                  </Text>
                )}

                {isLoading && <Loader c={theme.primaryColor} />}
              </Table.Td>
            </Table.Tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    <Text size='sm' lineClamp={4}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Group>
  );
};

export default BlogTable;
