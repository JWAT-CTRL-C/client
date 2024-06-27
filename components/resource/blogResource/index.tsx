import { convertIsoToDateTime } from '@/libs/utils';
import { upperFirst } from '@mantine/hooks';
import { FaRegArrowAltCircleUp, FaUserTie } from 'react-icons/fa';

import TagComp from '@/components/tag';

import { BlogResponse } from '@/libs/types/blogResponse';
import {
  BackgroundImage,
  Divider,
  Flex,
  Image,
  Spoiler,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core';

const BlogResource = ({ blog }: { blog: BlogResponse }) => {
  return (
    <Flex
      direction={'column'}
      className='mt-5 h-fit px-10 py-5'
      gap={'xl'}
      justify={'flex-start'}
      flex={{ base: 'auto', lg: 8 }}>
      <Text className='text-4xl' ta='center' fw={900}>
        {upperFirst(blog?.blog_tle as string)}
      </Text>

      <Flex justify={'space-between'}>
        <Flex align='center' className='text-lg'>
          <FaUserTie /> &nbsp;{' '}
          {blog?.user?.fuln?.toLocaleUpperCase() ?? blog?.user?.usrn?.toLocaleUpperCase()}
        </Flex>
        <Flex align='center' c={'green'} className='text-lg'>
          <FaRegArrowAltCircleUp /> &nbsp; {convertIsoToDateTime(blog?.crd_at!)}
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
      {(blog?.tags.length !== 0 || blog?.workspace || blog?.resource) && <Divider />}

      <Spoiler maxHeight={300} showLabel='Show more' hideLabel='Hide' transitionDuration={0}>
        {blog?.blog_cont && (
          <TypographyStylesProvider flex={1}>
            <article>
              <div dangerouslySetInnerHTML={{ __html: blog.blog_cont }} />
            </article>
          </TypographyStylesProvider>
        )}
      </Spoiler>
    </Flex>
  );
};

export default BlogResource;
