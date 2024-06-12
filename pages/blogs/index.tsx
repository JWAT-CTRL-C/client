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

const fakeDataBlogCards: BlogCardType[] = [
  {
    blog_id: '1',
    blog_tle: 'Norway Fjord Adventures',
    blog_cont: 'Explore the breathtaking fjords of Norway with our guided adventures.',
    crd_at: '2023-12-23T23:26:40.692Z',
    blog_image: undefined,
    auth_name: 'Mr.Terrafic',
    blog_tag: [
      {
        tag_id: 1,
        tag_name: 'onSale',
        crd_at: '2023-12-01T23:26:40.692Z',
        upd_at: '2023-12-01T23:26:40.692Z'
      }
    ],
    blog_rtg: 5
  },
  {
    blog_id: '2',
    blog_tle: 'Discover the Alps',
    blog_cont: 'Join us on a journey through the majestic Alps and discover stunning landscapes.',
    crd_at: '2024-01-15T23:26:40.692Z',
    blog_image: undefined,
    auth_name: 'Ms.Mountain',
    blog_tag: [
      {
        tag_id: 2,
        tag_name: 'new',
        crd_at: '2024-01-01T23:26:40.692Z',
        upd_at: '2024-01-01T23:26:40.692Z'
      }
    ],
    blog_rtg: 2
  },
  {
    blog_id: '3',
    blog_tle: 'Sahara Desert Expedition',
    blog_cont: 'Experience the vast and beautiful Sahara Desert with our expert guides.',
    crd_at: '2024-02-10T23:26:40.692Z',
    blog_image: undefined,
    auth_name: 'Dr.Sand',
    blog_tag: [
      {
        tag_id: 3,
        tag_name: 'popular',
        crd_at: '2024-02-01T23:26:40.692Z',
        upd_at: '2024-02-01T23:26:40.692Z'
      }
    ],
    blog_rtg: 3
  },
  {
    blog_id: '4',
    blog_tle: 'Amazon Rainforest Journey',
    blog_cont: 'Dive into the heart of the Amazon Rainforest and explore its rich biodiversity.',
    crd_at: '2024-03-05T23:26:40.692Z',
    blog_image: null,
    auth_name: 'Mr.Green',
    blog_tag: [
      {
        tag_id: 4,
        tag_name: 'recommended',
        crd_at: '2024-03-01T23:26:40.692Z',
        upd_at: '2024-03-01T23:26:40.692Z'
      }
    ],
    blog_rtg: 2.2
  },
  {
    blog_id: '5',
    blog_tle: 'Great Barrier Reef Diving',
    blog_cont: 'Discover the underwater wonders of the Great Barrier Reef with our diving tours.',
    crd_at: '2024-04-20T23:26:40.692Z',
    blog_image: undefined,
    auth_name: 'Ms.Ocean',
    blog_tag: [
      {
        tag_id: 5,
        tag_name: 'featured',
        crd_at: '2024-04-01T23:26:40.692Z',
        upd_at: '2024-04-01T23:26:40.692Z'
      }
    ],
    blog_rtg: 1.5
  }
];

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}

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
