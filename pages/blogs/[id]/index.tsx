import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import BlogItem from '@/components/blogItem';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogSkeleton from '@/components/skeletons/blogSkeleton';
import { setContext } from '@/libs/api';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { prefetchBlogById, prefetchRelatedBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Flex } from '@mantine/core';
import NoData from '@/components/shared/EmptyData';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const { id } = context.query;

  const queryClient = new QueryClient();

  await Promise.all([
    prefetchBlogById(queryClient, id as string),

    prefetchRelatedBlogs(queryClient, id as string),

    prefetchMyInfo(queryClient)
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const BlogInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading } = useFetchBlogById(id as string);

  return isLoading ? (
    <>
      <Head>
        <title>Loading... | Synergy</title>
        <meta name='description' content='Loading...' />
      </Head>

      <BlogSkeleton />
    </>
  ) : !blog || _.isEmpty(blog) ? (
    <Flex justify={'center'} className='my-10'>
      <NoData title='No Blog' />
    </Flex>
  ) : (
    <>
      <Head>
        <title>
          {blog?.blog_tle?.slice(0, 20) + ((blog?.blog_tle?.length ?? 0) > 20 ? '...' : '') ?? 'Blog'} |
          Synergy
        </title>
        <meta name='description' content={blog?.blog_tle?.slice(0, 20) ?? 'Blog'} />
      </Head>

      <BlogItem blog={blog} />
    </>
  );
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
