import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Container } from '@mantine/core';
import React from 'react';

const YourBlog = () => {
  return <Container>YourBlog</Container>;
};

export default YourBlog;

YourBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
