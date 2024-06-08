import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useRouter } from 'next/router';
import React from 'react';

const BlogInfo = () => {
  const router = useRouter();
  return <div>{router.query.id}</div>;
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
