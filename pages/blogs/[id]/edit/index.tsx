import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { setContext } from '@/libs/api';
import { useUpdateBlog } from '@/libs/hooks/mutations/blogMutations';
import { useFetchBlogById } from '@/libs/hooks/queries/blogQueries';
import { useFetchWorkspacesByUser } from '@/libs/hooks/queries/workspaceQueries';
import { prefetchBlogById } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { preFetchMyWorkspace } from '@/libs/prefetchQueries/workspace';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';
import { Center, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const { id } = context.query;

  const queryClient = new QueryClient();

  await Promise.all([
    prefetchBlogById(queryClient, id as string),
    prefetchMyInfo(queryClient),
    preFetchMyWorkspace(queryClient)
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
  const { workspaces: workSpaceList } = useFetchWorkspacesByUser();
  //const { uploadImage, imageUrl, isPending: IsPendingImage } = useUploadImage();

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

    try {
      await updateBlog({
        blog_id: router.query.id as string,
        blogData: filteredValues as blogFormType
      });
      showSuccessToast('Update blog successfully!');

      await router.push('/blogs/myBlogs');
    } catch (error) {
      console.error('Error Delete blog:', error);
      showErrorToast(`${Array.isArray(error) ? error.join('\n') : error}`);
      return;
    }
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
    <>
      <Head>
        <title>Edit blog | Synergy</title>
        <meta name='description' content={blog?.blog_tle?.slice(0, 20) ?? 'Blog'} />
      </Head>

      <Flex direction='column' gap={3} className='px-10 py-12'>
        <Center>
          <Title order={1}>Edit blog</Title>
        </Center>
        <Group justify='center' className='w-full'>
          {/* To use update form please provide isEditing and updateValues*/}
          <BlogForm
            handleSubmitForm={handleEdit}
            workSpaceList={workSpaceList ? workSpaceList : []}
            isEditing
            updateValues={updateValues}
          />
        </Group>
      </Flex>
    </>
  );
};

export default EditBlog;

EditBlog.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
