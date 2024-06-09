import { BlogCardType } from '@/libs/types/blogCardType';
import { convertIsotoDate } from '@/libs/utils';
import { Avatar, Card, Flex, Group, Image, Rating, Text, Title } from '@mantine/core';

const BlogCard = ({ blog }: { blog: BlogCardType }) => {
  const defaultBackground =
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png';

  return (
    <Card className='flex cursor-pointer justify-between' shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image src={blog.blog_image || defaultBackground} height={30} alt='Norway' />
      </Card.Section>

      <Flex direction={'column'} mt='md' mb='xs' wrap='nowrap' gap='md'>
        {/* <Badge color={`${tagColors[blog.tag]}`}>{blog.tag}</Badge> */}
        <Text fw={500} size='md' className=' text-xl'>
          {blog.blog_tle}
        </Text>
      </Flex>

      <Title className=' text-sm' size='sm' lineClamp={3} c='dimmed' fw={400}>
        {blog.blog_cont}
      </Title>
      <Group mt='md' mb='xs' align='center' wrap='nowrap' justify='space-between'>
        <Avatar size={'md'} src={blog.auth_img} alt="it's me" />
        <Group flex={1} align='center' wrap='nowrap' justify='space-between' className=''>
          <Text size='xs'>{blog.auth_name}</Text>
          <Text size='xs'>{convertIsotoDate(blog.crd_at as string)}</Text>
        </Group>
      </Group>

      <Group>
        <Rating defaultValue={blog.blog_rtg} readOnly />
      </Group>
    </Card>
  );
};

export default BlogCard;
