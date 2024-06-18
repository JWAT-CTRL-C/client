import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import TagComp from '@/components/tag';
import { setContext } from '@/libs/api';
import { BlogQueryEnum, useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { fetchBlogById } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import { Flex, LoadingOverlay, Rating, Text, Title, TypographyStylesProvider } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const { id } = context.query;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [BlogQueryEnum.BLOGS, id as string],
      queryFn: async () => await fetchBlogById(id as string)
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

const BlogInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading, isError } = useFetchBlogById(id as string);
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <Flex direction={'column'} gap={'lg'}>
      <Title order={1}>{blog?.blog_tle}</Title>
      {blog?.tags && (
        <Flex direction={'column'} gap={'md'} wrap={'wrap'}>
          <Title order={2}>Tags :</Title>
          <Flex gap={'sm'}>{blog?.tags.map((tag) => <TagComp key={tag.tag_id} tag={tag.tag_name} />)}</Flex>
        </Flex>
      )}
      {blog?.workspace && (
        <Flex align={'center'}>
          <Text fw={'bold'}>Workspace : </Text>
          <Text>{blog?.workspace?.wksp_name}</Text>
        </Flex>
      )}

      {blog?.resource && (
        <Flex align={'center'}>
          <Text fw={'bold'}>Resource :</Text>
          <Text>{blog?.resource?.resrc_name}</Text>
        </Flex>
      )}

      {blog?.blog_cont && (
        <TypographyStylesProvider>
          <article>
            <div dangerouslySetInnerHTML={{ __html: blog.blog_cont }} />
          </article>
        </TypographyStylesProvider>
      )}

      <Rating defaultValue={2} />
    </Flex>
  );
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
