import { BlogCardType } from '@/libs/types/blogCardType';
import { Avatar, Card, Flex, Group, Image, Rating, Text, Title } from '@mantine/core';

const BlogCard = ({ blog }: { blog: BlogCardType }) => {
  return (
    <Card className='flex cursor-pointer justify-between' shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image
          src={
            blog.bgUrl || 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'
          }
          height={30}
          alt='Norway'
        />
      </Card.Section>

      <Flex direction={'column'} mt='md' mb='xs' wrap='nowrap' gap='md'>
        {/* <Badge color={`${tagColors[blog.tag]}`}>{blog.tag}</Badge> */}
        <Text fw={500} size='md' className='cursor-text text-xl'>
          {blog.title}
        </Text>
      </Flex>

      <Title className='cursor-text text-sm' size='sm' lineClamp={3} c='dimmed' fw={400}>
        {blog.description}
      </Title>
      <Group mt='md' mb='xs' align='center' wrap='nowrap' justify='space-between'>
        <Avatar size={'md'} src={blog.authorAvatar ? blog.authorAvatar : null} alt="it's me" />
        <Group flex={1} align='center' wrap='nowrap' justify='space-between' className='cursor-text'>
          <Text size='xs'>{blog.authorName}</Text>
          <Text size='xs'>{blog.createdAt}</Text>
        </Group>
      </Group>

      <Group>
        <Rating defaultValue={blog.rating} readOnly />
      </Group>
    </Card>
  );
};

export default BlogCard;
