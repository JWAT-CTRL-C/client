import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { blogFormType } from '@/libs/types/blogFormType';
import { Center, Container, Flex, Group, Title } from '@mantine/core';
import React from 'react';

const CreateBlog = () => {
  const workSpaceList: string[] = ['React', 'Ángular', 'Vue'];

  // const updateValues = {
  //   title: 'dwqdwq',
  //   tag: ['apple', 'camera', 'def'] as string[],
  //   workspace: workSpaceList[1],
  //   backgroundImg: 'https://i1.sndcdn.com/avatars-000787434634-i9sqvl-t240x240.jpg',
  //   content: '<b>Hello</b>!'
  // };

  const handleCreateBlog = (values: blogFormType) => {
    console.log('handleCreateBlog:', values);
  };
  return (
    <Flex direction='column' gap={3}>
      <Center>
        <Title order={1}>Create new blog</Title>
      </Center>
      <Group justify='center' className='w-full'>
        {/* To use updateform please provide isEditing and updateValues*/}
        <BlogForm
          handleSubmitForm={handleCreateBlog}
          workSpaceList={workSpaceList}
          // isEditing
          // updateValues={updateValues}
        />
      </Group>
    </Flex>
  );
};

export default CreateBlog;

CreateBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
