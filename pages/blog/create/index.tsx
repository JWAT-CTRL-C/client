import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Center, Container, Title } from '@mantine/core';
import React from 'react';

const CreateBlog = () => {
  return (
    <Container>
      <Center>
        <Title order={1}>Create new blog</Title>
      </Center>
    </Container>
  );
};

export default CreateBlog;

CreateBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
