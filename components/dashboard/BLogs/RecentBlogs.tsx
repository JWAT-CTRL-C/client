import { SimpleGrid } from '@mantine/core';

export interface IRecentBlogsProps {}

export default function RecentBlogs({}: IRecentBlogsProps) {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
      spacing={{ base: 5, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
      {/* {blogs && transformBlogData(blogs).map((blog) => <BlogCard blog={blog} key={blog.blog_id} />)} */}
    </SimpleGrid>
  );
}
