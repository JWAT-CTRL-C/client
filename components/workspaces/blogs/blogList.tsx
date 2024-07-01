import BlogCard from '@/components/blogCard';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Collapse, Image } from '@mantine/core';
import { cn, useBreakpoint } from '@/libs/utils';
import { BlogResponse } from '@/libs/types/blogResponse';
import NoData from '@/components/shared/EmptyData';
import { useRouter } from 'next/router';
import { useFetchBlogsWorkspace } from '@/libs/hooks/queries/blogQueries';
import _ from 'lodash';
import BlogsSkeleton from '@/components/skeletons/blogsSkeleton';

export default function BlogList() {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);
  const { blogs, blogsPending } = useFetchBlogsWorkspace(router.query.id as string);
  const breakpoint = useBreakpoint();
  const breakpointType: { [breakpoint: string]: { length: number } } = {
    lg: {
      length: 3
    },
    md: {
      length: 3
    },
    sm: {
      length: 2
    },
    xs: {
      length: 1
    }
  };
  if (blogsPending) return;
  <BlogsSkeleton />;

  return (
    <div className='py-3'>
      {_.isNil(blogs) || blogs.length === 0 ? (
        <NoData title='No blogs found' />
      ) : (
        <>
          <Box className='mb-5 flex justify-self-end'>
            <Button
              onClick={toggle}
              variant='outline'
              className={cn(blogs.length > breakpointType[breakpoint].length ? '' : 'hidden')}>
              {!opened ? 'View all' : 'View less'}
            </Button>
          </Box>
          <Box
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
              !opened ? 'h-auto' : 'hidden'
            )}>
            {blogs.map(
              (blog, index) =>
                index < breakpointType[breakpoint].length && <BlogCard key={blog.blog_id} blog={blog} />
            )}
          </Box>
          <Collapse in={opened} animateOpacity={false} transitionDuration={0}>
            <div
              className={cn(
                'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
                opened ? 'h-auto' : 'hidden'
              )}>
              {blogs.map((blog, index) => (
                <BlogCard key={blog.blog_id} blog={blog} />
              ))}
            </div>
          </Collapse>
        </>
      )}
    </div>
  );
}
