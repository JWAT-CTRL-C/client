import BlogCard from '@/components/blogCard';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Collapse } from '@mantine/core';
import { cn, useBreakpoint } from '@/libs/utils';
import { BlogResponse } from '@/libs/types/blogResponse';

export default function BlogList({ blogs }: { blogs: BlogResponse[] }) {
  const [opened, { toggle }] = useDisclosure(false);
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

  return (
    <div className='py-3'>
      {blogs.length === 0 ? (
        <div className='bg-slate-100 p-5'> No blogs</div>
      ) : (
        <>
          <Box className='mb-5 flex justify-end'>
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
