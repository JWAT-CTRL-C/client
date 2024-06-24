import { GetServerSideProps } from 'next';

import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogs } from '@/libs/hooks/queries/blogQueries';

import { fetchBlogs } from '@/services/blogServices';
import { Center, Flex, LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { prefetchBlogs } from '@/libs/prefetchQueries/blog';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([prefetchBlogs(queryClient), prefetchMyInfo(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const Blogs = () => {
  const { data: blogs, isLoading, isError } = useFetchBlogs();

  if (isError)
    return (
      <Flex align={'center'}>
        <Center>
          <Title>Error</Title>
        </Center>
      </Flex>
    );

  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <SimpleGrid
      className='px-10 py-12'
      cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
      spacing={{ base: 5, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
      {blogs && blogs.map((blog) => <BlogCard blog={blog} key={blog.blog_id} />)}
    </SimpleGrid>
  );
};

export default Blogs;

Blogs.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
