import DefaultLayout from '@/components/layouts/DefaultLayout';
import React from 'react';

const Blog = () => {
  return <div>Blog</div>;
};

export default Blog;


Blog.getLayout = function getLayout(page: any) {
  return (
    
      <DefaultLayout>{page}</DefaultLayout>
   
  )
}