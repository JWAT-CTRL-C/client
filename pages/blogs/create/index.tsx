import { useRouter } from 'next/router';

import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';

import { useCreateBlog, useUploadImage } from '@/libs/hooks/mutations/blogMutations';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import { blogFormType } from '@/libs/types/blogFormType';
import { Center, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { ReactNode } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';

const CreateBlog = () => {
  const { uploadImage, imageUrl, isPending: isPendingImage } = useUploadImage();
  const { createBlog, isPending: isPendingCreateBlog } = useCreateBlog();
  const { workspaces, isPending, isError } = useFetchWorkspacesByUser();
  const router = useRouter();

  const handleCreateBlog = async (values: blogFormType) => {
    let imageUrlResponse = '';

    if (values.blog_img && typeof values.blog_img !== 'string') {
      try {
        imageUrlResponse = await uploadImage(values.blog_img);
      } catch (error) {
        showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
        return;
      }
    }

    const filteredValues = {
      ...values,
      blog_img: imageUrlResponse || values.blog_img
    };

    try {
      await createBlog(filteredValues as blogFormType);
      showSuccessToast('Create blog successfully!');

      await router.push('/blogs');
    } catch (error) {
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
  };

  if (isPendingCreateBlog || isPendingImage)
    return (
      <LoadingOverlay
        visible={isPendingCreateBlog || isPendingImage}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );

  return (
    <Flex direction='column' gap={3} className='px-10 py-12'>
      <Center>
        <Title order={1}>Create new blog</Title>
      </Center>
      <Group justify='center' className='w-full'>
        {/* To use update form please provide isEditing and updateValues*/}
        <BlogForm
          handleSubmitForm={handleCreateBlog}
          workSpaceList={workspaces ? workspaces : []}
          // isEditing
          // updateValues={updateValues}
        />
      </Group>
    </Flex>
  );
};

export default CreateBlog;

CreateBlog.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
