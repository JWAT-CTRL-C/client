import _ from 'lodash';

import BlogCard from '@/components/blogCard';
import NoData from '@/components/shared/EmptyData';
import BlogsSkeleton from '@/components/skeletons/blogsSkeleton';
import { useFetchRecentBlogs } from '@/libs/hooks/queries/blogQueries';
import { Flex, SimpleGrid } from '@mantine/core';

export interface IRecentBlogsProps {}

export default function RecentBlogs({}: IRecentBlogsProps) {
  const { data: blogs, isPending } = useFetchRecentBlogs();

  return (
    <div className='px-1 py-2 md:px-3 md:py-5'>
      {isPending ? (
        <BlogsSkeleton />
      ) : !blogs || _.isEmpty(blogs) ? (
        <Flex justify={'center'} className='my-10'>
          <NoData title='No Recent Blogs' />
        </Flex>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing={{ base: 5, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}>
          {blogs.map((blog) => (
            <BlogCard blog={blog} key={blog.blog_id} />
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}
