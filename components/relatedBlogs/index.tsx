import { BlogResponse } from '@/libs/types/blogResponse';
import { Flex } from '@mantine/core';
import React from 'react';
import BlogCard from '../blogCard';

const RelatedBlogs = ({ blogs }: { blogs: BlogResponse[] }) => {
  return (
    <Flex direction={'column'} gap='20'>
      {blogs && blogs?.map((blog) => <BlogCard blog={blog} key={blog.blog_id} />)}
    </Flex>
  );
};

export default RelatedBlogs;
