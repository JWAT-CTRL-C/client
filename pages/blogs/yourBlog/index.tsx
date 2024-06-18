import { GetServerSideProps } from 'next';

import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { BlogQueryEnum, useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { transformBlogTableType } from '@/libs/utils';
import { fetchBlogsForCurrentUser } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import { Flex, LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER],
      queryFn: async () => await fetchBlogsForCurrentUser()
    }),
    queryClient.prefetchQuery({
      queryKey: [MY_INFO_KEY],
      queryFn: () => fetchUserById('me')
    })
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

YourBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
