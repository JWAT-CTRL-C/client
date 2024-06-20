import { GetServerSideProps } from 'next';

import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { transformBlogTableType } from '@/libs/utils';
import { fetchBlogsForCurrentUser } from '@/services/blogServices';
import { Flex, LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { ReactNode } from 'react';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
      queryFn: async () => await fetchBlogsForCurrentUser()
    }),
    prefetchMyInfo(queryClient)
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
const YourBlog = () => {
  const { data: blogs, isLoading, isError } = useFetchBlogsCurrentUser();
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <Flex>
      <BlogTable dataTable={blogs ? transformBlogTableType(blogs) : []} />
    </Flex>
  );
};

export default YourBlog;

YourBlog.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
