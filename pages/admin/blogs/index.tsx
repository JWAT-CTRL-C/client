import BlogCompTable from '@/components/adminComp/blogCompTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsMasterAdmin } from '@/libs/hooks/queries/blogQueries';
import { prefetchMasterAdminBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([prefetchMyInfo(queryClient), prefetchMasterAdminBlogs(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const BlogsAdminPage = () => {
  const [pageBlogs, setPageBlogs] = useState<number>(1);
  const {
    data: blogs,
    isError: isErrorBlogs,
    isLoading: isLoadingBlogs
  } = useFetchBlogsMasterAdmin(pageBlogs);
  const handlePagingBlogs = (newPage: number) => {
    setPageBlogs(newPage);
  };

  return (
    <Can I='reach' a='BlogsAdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <>
            <Head>
              <title>Blogs | Admin</title>
              <meta name='description' content='Admin-blogs' />
            </Head>
            <Flex direction='column' gap={3}>
              <div className='mb-3'>
                <BlogCompTable
                  currentPage={pageBlogs}
                  dataTable={blogs as BlogResponseWithPagination}
                  onPagination={handlePagingBlogs}
                  isLoading={isLoadingBlogs}
                />
              </div>
            </Flex>
          </>
        ) : (
          <Flex direction='column' gap={3}>
            You are not allowed to access this page
          </Flex>
        )
      }
    </Can>
  );
};

export default BlogsAdminPage;

BlogsAdminPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
