import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogs } from '@/libs/hooks/queries/blogQueries';
import { prefetchBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { Center, Flex, Loader, LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

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
  const { data: blogs, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useFetchBlogs();
  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);

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
    <>
      <SimpleGrid
        className='px-10 py-12'
        cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
        spacing={{ base: 5, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}>
        {blogs && blogs.map((blog) => <BlogCard blog={blog} key={blog.blog_id} />)}
      </SimpleGrid>

      {hasNextPage && (
        <div className='flex-center my-3 w-full p-3' ref={ref}>
          {isFetchingNextPage && <Loader size={30} />}
        </div>
      )}
    </>
  );
};

export default Blogs;

Blogs.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
