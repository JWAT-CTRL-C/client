import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useFetchBlogs } from '@/libs/hooks/queries/blogQueries';
import { BlogCardType } from '@/libs/types/blogCardType';
import { transformBlogData } from '@/libs/utils';
import { fetchBlogs } from '@/services/blogServices';
import { Center, Flex, LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import React from 'react';

// export async function getServerSideProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['blogs'],
//     queryFn: fetchBlogs
//   });

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient)
//     }
//   };
// }

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
      cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
      spacing={{ base: 5, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
      {blogs && transformBlogData(blogs).map((blog) => <BlogCard blog={blog} key={blog.blog_id} />)}
    </SimpleGrid>
  );
};

export default Blogs;

Blogs.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
