import { upperFirst } from 'lodash';
import { FaRegArrowAltCircleUp, FaRegCommentAlt } from 'react-icons/fa';

import CommentCard from '@/components/comment/commentCard';
import CommentInput from '@/components/comment/commentInput';
import ShowContent from '@/components/EditorContent';
import LoveIcon from '@/components/loveIcon';
import RelatedBlogs from '@/components/relatedBlogs';
import NoData from '@/components/shared/EmptyData';
import { showErrorToast } from '@/components/shared/toast';
import TagComp from '@/components/tag';
import { useCreateBlogComment, useRatingBlog } from '@/libs/hooks/mutations/blogMutations';
import { useFetchRelatedBlog } from '@/libs/hooks/queries/blogQueries';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { BlogResponse } from '@/libs/types/blogResponse';
import { convertIsoToDateTime } from '@/libs/utils';
import { Avatar, Divider, Flex, Image, ScrollArea, Spoiler, Text, ThemeIcon, Title } from '@mantine/core';
import RelatedBlogsSkeleton from '../skeletons/relatedBlogsSkeleton';

export interface IBlogItemProps {
  blog: BlogResponse;
}

export default function BlogItem({ blog }: IBlogItemProps) {
  const defaultImage = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png';

  const {
    createBlogComment,
    isPending: isLoadingComments,
    isSuccess: isSuccessComment
  } = useCreateBlogComment();

  const { user } = useMyInfo();
  const { ratingBlog, isPending: isLoadingRating } = useRatingBlog();
  const { data: relatedBlogs, isPending } = useFetchRelatedBlog(blog.blog_id);

  const isLoveBlog = blog?.blogRatings?.find((rating) => rating.user.user_id === user?.user_id)?.is_rated;

  const totalLoveBlog = blog?.blogRatings?.filter((rating) => rating.is_rated === true);

  const handleCommentBlog = async (comment: string) => {
    try {
      await createBlogComment({ blog_id: blog.blog_id, blog_cmt_cont: comment });
    } catch (error) {
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
  };

  const handleRating = async () => {
    try {
      await ratingBlog({ blog_id: blog.blog_id });
    } catch (error) {
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
  };

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={'xl'} px={20} py={24} className='relative'>
      <Flex
        direction={'column'}
        className='pr-3'
        gap={'xl'}
        justify={'center'}
        flex={{ base: 'auto', lg: 8 }}>
        <Image
          className='object-contain'
          radius='md'
          src={blog?.blogImage?.blog_img_url ?? defaultImage}
          mah={500}
          w={'100%'}
        />

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
            <Avatar src={blog?.user?.avatar} /> &nbsp;
            {blog?.user?.fuln?.toLocaleUpperCase() ?? blog?.user?.usrn?.toLocaleUpperCase()}
          </Flex>
          <Flex align='center' c={'green'} className='text-lg'>
            <FaRegArrowAltCircleUp /> &nbsp; {convertIsoToDateTime(blog?.crd_at!)}
          </Flex>
        </Flex>
        {/* <Divider /> */}

        {blog?.tags.length !== 0 && (
          <Flex direction={'column'} gap={'md'} wrap={'wrap'}>
            <Title order={2}>Tags:</Title>
            <Flex gap={'sm'}>{blog?.tags.map((tag) => <TagComp key={tag.tag_id} tag={tag.tag_name} />)}</Flex>
          </Flex>
        )}

        {blog?.workspace && (
          <Flex align={'center'}>
            <Text fw={'bold'}>Workspace: &nbsp; </Text>
            <Text>{blog?.workspace?.wksp_name}</Text>
          </Flex>
        )}

        {blog?.resource && (
          <Flex align={'center'}>
            <Text fw={'bold'}>Resource: &nbsp; </Text>
            <Text>{blog?.resource?.resrc_name}</Text>
          </Flex>
        )}
        {/* {(blog?.tags.length !== 0 || blog?.workspace || blog?.resource) && <Divider />} */}

        <Spoiler maxHeight={800} showLabel='Show more' hideLabel='Show less' transitionDuration={0}>
          {blog?.blog_cont && <ShowContent content={blog.blog_cont} />}
        </Spoiler>

        <Divider />

        <Flex align={'center'} justify='start' gap={5}>
          <Flex justify='center' align={'center'}>
            <LoveIcon
              onRating={handleRating}
              isLoveBlog={isLoveBlog as boolean}
              isLoading={isLoadingRating}
            />
            <Text>&nbsp;{totalLoveBlog?.length ?? 0}</Text>
          </Flex>
          <Flex justify='center' align={'center'}>
            <ThemeIcon variant='subtle'>
              <FaRegCommentAlt />
            </ThemeIcon>

            <Text>&nbsp;{blog?.blogComments.length ?? 0}</Text>
          </Flex>
        </Flex>
        {/* <Divider /> */}
        <CommentInput
          loading={isLoadingComments}
          isSuccess={isSuccessComment}
          onComment={handleCommentBlog}
        />
        {/* <Divider /> */}
        <Text size='lg' fw={'bold'}>
          COMMENTS :
        </Text>
        <ScrollArea h={350} scrollbarSize={4} scrollHideDelay={500}>
          <Flex direction={'column'} gap={20}>
            {blog?.blogComments.map((comment) => <CommentCard key={comment.blog_cmt_id} comment={comment} />)}
            {blog?.blogComments.length === 0 && (
              <Flex justify={'center'} className='my-10'>
                <NoData title='No comments found' />
              </Flex>
            )}
          </Flex>
        </ScrollArea>
      </Flex>
      {/* <Divider orientation='vertical' /> */}
      <Flex
        direction={'column'}
        gap={'xl'}
        w={'1/6'}
        className='top-4 h-full lg:sticky'
        flex={{ base: 'auto', md: 'auto', sm: 'auto', lg: 3 }}>
        <Title>Related Blogs</Title>
        {isPending || !relatedBlogs ? <RelatedBlogsSkeleton /> : <RelatedBlogs blogs={relatedBlogs} />}
      </Flex>
    </Flex>
  );
}
