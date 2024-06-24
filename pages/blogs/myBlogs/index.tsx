import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { prefetchCurrentUserBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { transformBlogTableType } from '@/libs/utils';
import { Flex, LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

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
  const { data: blogs, isLoading, isError } = useFetchBlogsCurrentUser();
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <Flex className=''>
      <BlogTable dataTable={blogs ? transformBlogTableType(blogs) : []} />
    </Flex>
  );
};

export default MyBlogs;

MyBlogs.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
