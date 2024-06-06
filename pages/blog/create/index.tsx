import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Center, Container, Flex, Group, Title } from '@mantine/core';
import React from 'react';

const CreateBlog = () => {
  return (
    <Flex direction='column' gap={3}>
      <Center>
        <Title order={1}>Create new blog</Title>
      </Center>
      <Group justify='center' className='w-full'>
        <BlogForm />
      </Group>
    </Flex>
  );
};

export default CreateBlog;

CreateBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
