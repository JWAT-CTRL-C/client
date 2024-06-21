import { BlogCardType } from '@/libs/types/blogCardType';
import BlogCard from '@/components/blogCard';
import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Collapse } from '@mantine/core';
import { cn } from '@/libs/utils';

export default function BlogList({ blogs }: { blogs: BlogCardType[] }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div className='min-h-[30vh] p-3'>
      {blogs.length === 0 ? (
        <div className='grid h-full w-full place-items-center rounded-md border border-gray-100 bg-slate-50'>
          No blogs found
        </div>
      ) : (
        <>
          <Box className='mb-2 flex justify-end'>
            <Button onClick={toggle} variant='outline' className={cn(blogs.length > 3 ? '' : 'hidden')}>
              {!opened ? 'View all' : 'View less'}
            </Button>
          </Box>
          <Box
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
              !opened ? 'h-auto' : 'hidden'
            )}>
            {blogs.map((blog, index) => (
              <BlogCard key={blog.blog_id} blog={blog} />
            ))}
          </Box>
          <Collapse in={opened} animateOpacity={false} transitionDuration={0}>
            <div className={cn('grid grid-cols-3 gap-4', opened ? 'h-auto' : 'hidden')}>
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
