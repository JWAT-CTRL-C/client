import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useUpdateBlog } from '@/libs/hooks/mutations/blogMutations';
import { BlogQueryEnum, useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { useFetchWorkspacesCurrentUser } from '@/libs/hooks/queries/workspaceQueries';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';
import { fetchBlogById } from '@/services/blogServices';
import { fetchUserById } from '@/services/userServices';
import { Center, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const { id } = context.query;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [BlogQueryEnum.BLOGS, id as string],
      queryFn: async () => await fetchBlogById(id as string)
    }),
    queryClient.prefetchQuery({
      queryKey: ['myInfo'],
      queryFn: () => fetchUserById('me')
    }),
    queryClient.prefetchQuery({
      queryKey: ['workspaces-current-user'],
      queryFn: () => useFetchWorkspacesCurrentUser()
    })
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const EditBlog = () => {
  const router = useRouter();
  const { data: blog, isLoading } = useFetchBlogById(router.query.id as string);
  const { data: workSpaceList } = useFetchWorkspacesCurrentUser();
  //const { uploadImage, imageUrl, isPending: IspendingImage } = useUploadImage();

  const { updateBlog, isPending: isPendingUpdateBlog, isSuccess } = useUpdateBlog();

  const updateValues: blogFormType = {
    blog_tle: blog?.blog_tle ?? '',
    blog_tag: blog?.tags?.map((tag) => tag.tag_name) ?? [],
    blog_wksp: blog?.workspace?.wksp_id,
    blog_img: blog?.blogImage?.blog_img_url ?? '',
    blog_cont: blog?.blog_cont ?? '',
    blog_src: blog?.resource?.resrc_id
  };

  const handleEdit = async (values: blogFormType) => {
    // let imageUrlResponse = '';

    // if (values.blog_img && typeof values.blog_img !== 'string') {
    //   imageUrlResponse = await uploadImage(values.blog_img);
    // }

    const filteredValues = filterFalsyFields({
      ...values
      // blog_img: imageUrlResponse || values.blog_img
    });

    await updateBlog(
      {
        blog_id: router.query.id as string,
        blogData: filteredValues as blogFormType
      },
      {
        onSuccess: async () => await router.push('/blogs/yourBlog')
      }
    );
  };

  if (isPendingUpdateBlog || isLoading)
    return (
      <LoadingOverlay
        visible={isPendingUpdateBlog || isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );

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
