import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { upperFirst } from '@mantine/hooks';
import { convertIsoToDate } from '@/libs/utils';
import {
  FaCommentAlt,
  FaHeart,
  FaRegArrowAltCircleUp,
  FaRegCommentAlt,
  FaRegHeart,
  FaUserTie
} from 'react-icons/fa';
import CommentInput from '@/components/comment/commentInput';
import CommentCard from '@/components/comment/commentCard';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import TagComp from '@/components/tag';
import { setContext } from '@/libs/api';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { fetchBlogById } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import {
  ActionIcon,
  BackgroundImage,
  Divider,
  Flex,
  LoadingOverlay,
  Rating,
  ScrollArea,
  Skeleton,
  Spoiler,
  Text,
  ThemeIcon,
  Title,
  TypographyStylesProvider
} from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { useCreateBlogComment, useRatingBlog } from '@/libs/hooks/mutations/blogMutations';
import { useMyInfo, useUserInfo } from '@/libs/hooks/queries/userQueries';
import LoveIcon from '@/components/loveIcon';

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
  const { data: blog, isLoading } = useFetchBlogById(id as string);

  const { user } = useMyInfo();
  const {
    createBlogComment,
    isPending: isLoadingComments,
    isSuccess: isSuccessComment
  } = useCreateBlogComment();

  const { ratingBlog, isPending: isLoadingRating } = useRatingBlog();

  const isLoveBlog = blog?.blogRatings?.find((rating) => rating.user.user_id === user?.user_id)?.is_rated;

  const totalLoveBlog = blog?.blogRatings?.filter((rating) => rating.is_rated === true);
  const defaultImage = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png';
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

  const handleCommentBlog = async (comment: string) => {
    await createBlogComment({ blog_id: id as string, blog_cmt_cont: comment });
  };

  const handleRating = async () => {
    await ratingBlog({ blog_id: id as string });
  };

  return (
    <Flex direction={'column'} gap={'xl'} justify={'center'} className='w-full'>
      <Skeleton visible={isLoading}>
        <BackgroundImage
          className='flex min-h-60 items-center justify-center object-cover object-center'
          radius='md'
          src={blog?.blogImage?.blog_img_url ?? defaultImage}></BackgroundImage>
      </Skeleton>

      <Text
        className='text-4xl'
        ta='center'
        fw={900}
        c={'violet'}
        // variant='gradient'
        // gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
      >
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
        <Flex align={'center'}>
          <LoveIcon onRating={handleRating} isLoveBlog={isLoveBlog as boolean} isLoading={isLoadingRating} />
          <Text>&nbsp;{totalLoveBlog?.length ?? 0}</Text>
        </Flex>
        <Flex align={'center'}>
          <ThemeIcon variant='subtle'>
            <FaRegCommentAlt />
          </ThemeIcon>

          <Text>&nbsp;({blog?.blogComments.length ?? 0})</Text>
        </Flex>
      </Flex>
      <Divider />
      <CommentInput loading={isLoadingComments} isSuccess={isSuccessComment} onComment={handleCommentBlog} />
      <Divider />
      <Text size='lg' fw={'bold'}>
        COMMENTS :
      </Text>
      <ScrollArea h={350} scrollbarSize={4} scrollHideDelay={500}>
        <Flex direction={'column'} gap={20}>
          {blog?.blogComments.map((comment) => <CommentCard key={comment.blog_cmt_id} comment={comment} />)}
          {blog?.blogComments.length === 0 && (
            <Flex justify={'center'} className='my-10'>
              <Title className='text-3xl' fw={'bold'}>
                No comments
              </Title>
            </Flex>
          )}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
