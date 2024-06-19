import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { upperFirst } from '@mantine/hooks';
import { convertIsoToDate } from '@/libs/utils';
import { FaRegArrowAltCircleUp, FaRegCommentAlt, FaUserTie } from 'react-icons/fa';
import CommnetInput from '@/components/commnet/commentInput';
import { generateFakeBlogComments } from '@/components/commnet/fakeComment';
import CommentCard from '@/components/commnet/commentCard';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import TagComp from '@/components/tag';
import { setContext } from '@/libs/api';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { fetchBlogById } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import {
  BackgroundImage,
  Divider,
  Flex,
  LoadingOverlay,
  Rating,
  Spoiler,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';

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
  const defaultImage = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png';
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  const fakeBlogComments = generateFakeBlogComments(10);
  const handleCommentBlog = (comment: string) => {
    console.log(comment);
  };

  return (
    <Flex direction={'column'} gap={'xl'} justify={'center'} className='w-full'>
      <BackgroundImage
        className='flex min-h-60 items-center justify-center object-cover object-center opacity-70'
        radius='md'
        src={blog?.blogImage?.blog_img_url ?? defaultImage}></BackgroundImage>

      <Text
        size='lg'
        className='text-5xl'
        ta='center'
        fw={900}
        variant='gradient'
        gradient={{ from: 'blue', to: 'grape', deg: 204 }}>
        {upperFirst(blog?.blog_tle as string)}
      </Text>

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

      {blog?.tags.length !== 0 && (
        <Flex direction={'column'} gap={'md'} wrap={'wrap'}>
          <Title order={2}>Tags :</Title>
          <Flex gap={'sm'}>{blog?.tags.map((tag) => <TagComp key={tag.tag_id} tag={tag.tag_name} />)}</Flex>
        </Flex>
      )}

      {blog?.workspace && (
        <Flex align={'center'}>
          <Text fw={'bold'}>Workspace : &nbsp; &nbsp; </Text>
          <Text>{blog?.workspace?.wksp_name}</Text>
        </Flex>
      )}

      {blog?.resource && (
        <Flex align={'center'}>
          <Text fw={'bold'}>Resource : &nbsp; &nbsp; </Text>
          <Text>{blog?.resource?.resrc_name}</Text>
        </Flex>
      )}
      {blog?.tags.length !== 0 || blog?.workspace || (blog?.resource && <Divider />)}

      <Spoiler maxHeight={200} showLabel='Show more' hideLabel='Hide' transitionDuration={0}>
        {blog?.blog_cont && (
          <TypographyStylesProvider flex={1}>
            <article>
              <div dangerouslySetInnerHTML={{ __html: blog.blog_cont }} />
            </article>
          </TypographyStylesProvider>
        )}
      </Spoiler>

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
      <CommnetInput onComment={handleCommentBlog} />
      <Divider />
      <Text size='lg' fw={'bold'}>
        COMMENTS :
      </Text>
      <Flex direction={'column'} gap={20}>
        {fakeBlogComments.map((comment) => (
          <CommentCard key={comment.blog_cmt_id} comment={comment} />
        ))}
      </Flex>
    </Flex>
  );
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
