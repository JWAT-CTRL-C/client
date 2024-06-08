import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useRouter } from 'next/router';
import React from 'react';

const EditBlog = () => {
  const router = useRouter();
  return <div>{router.query.id}</div>;
};

export default EditBlog;

EditBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
