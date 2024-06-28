import { GetServerSideProps } from 'next';
import { ReactNode, useEffect, useState } from 'react';

import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { prefetchCurrentUserBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { transformBlogTableType } from '@/libs/utils';
import { Flex, LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([prefetchCurrentUserBlogs(queryClient), prefetchMyInfo(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
const MyBlogs = () => {
  const [page, setPage] = useState<number>(1);
  const [blogTitle, setBlogTitle] = useState<string>('');

  const { data: blogs, isLoading, isError } = useFetchBlogsCurrentUser(page, blogTitle);

  const handlePaging = (newPage: number) => {
    setPage(newPage);
  };

  function handleSearch(title: string) {
    setPage(1);
    setBlogTitle(title);
  }

  return (
    <>
      <Head>
        <title>My Blogs | Synergy</title>
        <meta name='description' content='My Blogs' />
      </Head>

      <Flex className=''>
        <BlogTable
          currentPage={page}
          dataTable={blogs as BlogResponseWithPagination}
          onPagination={handlePaging}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </Flex>
    </>
  );
};

export default MyBlogs;

MyBlogs.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
