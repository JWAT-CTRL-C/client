import { useRouter } from 'next/router';

import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useCreateBlog, useUploadImage } from '@/libs/hooks/mutations/blogMutations';
import { useFetchWorkspacesCurrentUser } from '@/libs/hooks/queries/workspaceQueries';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';
import { Center, Flex, Group, LoadingOverlay, Title } from '@mantine/core';

const CreateBlog = () => {
  const { uploadImage, imageUrl, isPending: isPendingImage } = useUploadImage();
  const { createBlog, isPending: isPendingCreateBlog } = useCreateBlog();
  const { data: workSpaceList, isLoading, isError, isSuccess } = useFetchWorkspacesCurrentUser();
  const router = useRouter();

  console.log(workSpaceList);

  const handleCreateBlog = async (values: blogFormType) => {
    let imageUrlResponse = '';

    if (values.blog_img && typeof values.blog_img !== 'string') {
      imageUrlResponse = await uploadImage(values.blog_img);
    }

    const filteredValues = filterFalsyFields({
      ...values,
      blog_img: imageUrlResponse || values.blog_img
    });

    await createBlog(filteredValues as blogFormType, {
      onSuccess: async () => await router.push('/blogs')
    });
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
    <Flex direction='column' gap={3}>
      <Center>
        <Title order={1}>Create new blog</Title>
      </Center>
      <Group justify='center' className='w-full'>
        {/* To use updateform please provide isEditing and updateValues*/}
        <BlogForm
          handleSubmitForm={handleCreateBlog}
          workSpaceList={workSpaceList ? workSpaceList : []}
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
