import { GetServerSideProps } from 'next';
import React from 'react';

import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import {  useFetchBlogs } from '@/libs/hooks/queries/blogQueries';
import { transformBlogData } from '@/libs/utils';
import { fetchBlogs } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import { Center, Flex, LoadingOverlay, SimpleGrid, Title } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [BlogQueryEnum.BLOGS],
      queryFn: fetchBlogs
    }),
    queryClient.prefetchQuery({
      queryKey: [MY_INFO_KEY],
      queryFn: async () => await fetchUserById('me')
    })
  ]);

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
