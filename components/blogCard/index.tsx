import { useRatingBlog } from '@/libs/hooks/mutations/blogMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { BlogResponse } from '@/libs/types/blogResponse';
import { getTimeDifference } from '@/libs/utils';
import {
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  Image,
  Space,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoveIcon from '../loveIcon';
import TagComp from '../tag';
import { showErrorToast } from '../shared/toast';

const BlogCard = ({ blog }: { blog: BlogResponse }) => {
  const router = useRouter();
  const { ratingBlog, isPending: isLoadingRating } = useRatingBlog();
  const { user } = useMyInfo();
  const theme = useMantineTheme();

  const isLoveBlog = blog?.blogRatings?.find((rating) => rating.user.user_id === user?.user_id)?.is_rated;

  const totalLoveBlog = blog?.blogRatings?.filter((rating) => rating.is_rated === true) ?? [];

  const defaultBackground =
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png';

  const [imageSrc, setImageSrc] = useState(blog?.blogImage?.blog_img_url || defaultBackground);

  const handleImageError = () => {
    setImageSrc(defaultBackground);
  };

  const handleRating = () => {
    ratingBlog(
      { blog_id: blog.blog_id },
      {
        onError: (error) => {
          showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
        }
      }
    );
  };

  const handleToBlog = async () => {
    router.push(`/blogs/${blog?.blog_id}`);
  };

  return (
    <Card
      //  onClick={handleToBlog}
      className='flex h-full w-full cursor-pointer justify-between'
      shadow='sm'
      padding='lg'
      radius='md'
      withBorder>
      <Card.Section mb='sm' onClick={handleToBlog}>
        <Image
          h={200}
          fit='cover'
          className='object-center'
          src={imageSrc}
          alt={blog.blog_tle}
          onError={handleImageError}
        />
      </Card.Section>

      <Group className='flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap'>
        {blog?.tags?.slice(0, 2).map((tag) => <TagComp key={tag?.tag_id} tag={tag?.tag_name} />)}
        {blog?.tags?.length > 2 && <Text c={theme.primaryColor}>+{blog.tags.length - 2} more </Text>}
        {blog?.tags?.length === 0 && <Badge className='opacity-0' />}
      </Group>

      <Tooltip
        label={blog?.blog_tle}
        position='bottom-start'
        withArrow
        arrowOffset={10}
        arrowSize={4}
        maw={300}
        multiline
        transitionProps={{ duration: 500 }}
        offset={5}>
        <Text fw={700} mt='md' className='overflow-clip' lineClamp={1} onClick={handleToBlog}>
          {upperFirst(blog.blog_tle)}
        </Text>
      </Tooltip>

      <Group mt='lg' className='w-full'>
        <Avatar src={blog?.user?.avatar} alt='author of blog' radius='sm' />
        <div>
          <Text fw={500}>{blog?.user?.fuln}</Text>
          <Text fz='xs' c='dimmed'>
            {getTimeDifference(blog?.crd_at)}
          </Text>
        </div>
      </Group>

      <Card.Section my='sm'>
        <Divider />
      </Card.Section>
      <Group justify='space-between'>
        <Text fz='xs' c='dimmed'>
          {totalLoveBlog.length ?? 0} people liked this
        </Text>
        <Group gap={0}>
          <LoveIcon onRating={handleRating} isLoveBlog={isLoveBlog as boolean} isLoading={isLoadingRating} />
        </Group>
      </Group>
    </Card>
  );
};

export default BlogCard;
