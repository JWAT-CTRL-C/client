import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useUpdateBlog, useUploadImage } from '@/libs/hooks/mutations/blogMutations';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import {
  useFetchWorkspacesCurrentUser,
  useFetchWorkspacesCurrentUserById
} from '@/libs/hooks/queries/workspaceQueries';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';
import { Center, Flex, Group, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';

const EditBlog = () => {
  const router = useRouter();
  const { data: blog } = useFetchBlogById(router.query.id as string);
  const { data: workSpaceList } = useFetchWorkspacesCurrentUser();
  const { uploadImage, imageUrl, isPending: IspendingImage } = useUploadImage();

  const { updateBlog, isPending: isPendingCreateBlog } = useUpdateBlog();

  const updateValues: blogFormType = {
    blog_tle: blog?.blog_tle ?? '',
    blog_tag: blog?.tags?.map((tag) => tag.tag_name) ?? [],
    blog_wksp: blog?.workspace?.wksp_id,
    blog_img: blog?.blogImage?.blog_img_url ?? '',
    blog_cont: blog?.blog_cont ?? '',
    blog_src: blog?.resource?.resrc_id
  };

  const handleEdit = async (values: blogFormType) => {
    let imageUrlResponse = '';

    if (values.blog_img && typeof values.blog_img !== 'string') {
      imageUrlResponse = await uploadImage(values.blog_img);
    }

    const filteredValues = filterFalsyFields({
      ...values,
      blog_img: imageUrlResponse || values.blog_img
    });

    await updateBlog({
      blog_id: router.query.id as string,
      blogData: filteredValues as blogFormType
    });
  };
  return (
    <Flex direction='column' gap={3}>
      <Center>
        <Title order={1}>Edit blog</Title>
      </Center>
      <Group justify='center' className='w-full'>
        {/* To use updateform please provide isEditing and updateValues*/}
        <BlogForm
          handleSubmitForm={handleEdit}
          workSpaceList={workSpaceList ? workSpaceList : []}
          isEditing
          updateValues={updateValues}
        />
      </Group>
    </Flex>
  );
};

export default EditBlog;

EditBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
