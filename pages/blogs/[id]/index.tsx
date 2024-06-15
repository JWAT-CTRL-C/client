import DefaultLayout from '@/components/layouts/DefaultLayout';
import TagComp from '@/components/tag';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { fetchBlogById } from '@/services/blogServices';
import {
  Flex,
  Group,
  Title,
  Text,
  TypographyStylesProvider,
  Rating,
  LoadingOverlay,
  Divider,
  Image,
  BackgroundImage,
  Box
} from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { upperFirst } from '@mantine/hooks';
import { convertIsoToDate } from '@/libs/utils';
import { FaRegArrowAltCircleUp, FaRegCommentAlt, FaUserTie } from 'react-icons/fa';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.query;

//   const queryClient = new QueryClient();

//   try {
//     await queryClient.prefetchQuery({
//       queryKey: ['blogs', id as string],
//       queryFn: async () => await fetchBlogById(id as string)
//     });
//   } catch (error) {
//     console.error('Error prefetching blogs:', error);
//   }

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient)
//     }
//   };
// };

const BlogInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: blog, isLoading, isError } = useFetchBlogById(id as string);
  const defaultImage = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png';
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  return (
    <Flex direction={'column'} gap={'xl'} justify={'center'} className='w-full'>
      <BackgroundImage
        className='flex h-60 items-center justify-center object-cover object-center opacity-70'
        radius='md'
        src={blog?.blogImage?.blog_img_url ?? defaultImage}>
        <Text
          size='lg'
          className='text-7xl'
          ta='center'
          fw={900}
          variant='gradient'
          gradient={{ from: 'blue', to: 'grape', deg: 204 }}>
          {upperFirst(blog?.blog_tle as string)}
        </Text>
      </BackgroundImage>

      <Flex justify={'space-between'}>
        <Flex align='center' className='text-lg'>
          <FaUserTie /> &nbsp;{' '}
          {blog?.user?.fuln?.toLocaleUpperCase() ?? blog?.user?.usrn?.toLocaleUpperCase()}
        </Flex>
        <Flex align='center' c={'green'} className='text-lg'>
          <FaRegArrowAltCircleUp /> &nbsp; {convertIsoToDate(blog?.crd_at!)}
        </Flex>
      </Flex>
      <Divider />

      {blog?.tags ||
        (blog?.tags.length !== 0 && (
          <Flex direction={'column'} gap={'md'} wrap={'wrap'}>
            <Title order={2}>Tags :</Title>
            <Flex gap={'sm'}>{blog?.tags.map((tag) => <TagComp key={tag.tag_id} tag={tag.tag_name} />)}</Flex>
          </Flex>
        ))}
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
      {blog?.tags || blog?.workspace || (blog?.resource && <Divider />)}

      {blog?.blog_cont && (
        <TypographyStylesProvider flex={1}>
          <article>
            <div dangerouslySetInnerHTML={{ __html: blog.blog_cont }} />
          </article>
        </TypographyStylesProvider>
      )}
      <Divider />

      <Flex align={'center'} justify='space-between'>
        <Rating defaultValue={2} />
        <Flex align={'center'} className='text-xl'>
          <FaRegCommentAlt />
          &nbsp;
          <Text>({blog?.blogComments.length ?? 0})</Text>
        </Flex>
      </Flex>
      <Divider />
      <Text size='lg' fw={'bold'}>
        COMMENTS :
      </Text>
    </Flex>
  );
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
