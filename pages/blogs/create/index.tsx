import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useCreateBlog, useUploadImage } from '@/libs/hooks/mutations/blogMutations';

import { blogFormType } from '@/libs/types/blogFormType';
import { workspacesType } from '@/libs/types/workspacesType';
import { filterFalsyFields } from '@/libs/utils';
import { fetchBlogs } from '@/services/blogServices';
import { Center, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';

const CreateBlog = () => {
  const { uploadImage, imageUrl, isPending: IspendingImage } = useUploadImage();
  const { createBlog, isPending: isPendingCreateBlog } = useCreateBlog();

  // Use api to get workspaces belong to current user
  const workSpaceList: workspacesType[] = [
    {
      wksp_id: 'ws1',
      wksp_name: 'Workspace 1',
      wksp_desc: 'Description for Workspace 1',
      wksp_src: [
        {
          src_id: 'src1',
          src_url: 'http://example.com/source1',
          src_name: 'Source 1'
        },
        {
          src_id: 'src2',
          src_url: 'http://example.com/source2',
          src_name: 'Source 2'
        }
      ]
    },
    {
      wksp_id: 'ws2',
      wksp_name: 'Workspace 2',
      wksp_desc: 'Description for Workspace 2',
      wksp_src: [
        {
          src_id: 'src3',
          src_url: 'http://example.com/source3',
          src_name: 'Source 3'
        },
        {
          src_id: 'src4',
          src_url: 'http://example.com/source4',
          src_name: 'Source 4'
        }
      ]
    },
    {
      wksp_id: 'ws3',
      wksp_name: 'Workspace 3',
      wksp_desc: 'Description for Workspace 3',
      wksp_src: [
        {
          src_id: 'src5',
          src_url: 'http://example.com/source5',
          src_name: 'Source 5'
        },
        {
          src_id: 'src6',
          src_url: 'http://example.com/source6',
          src_name: 'Source 6'
        }
      ]
    }
  ];
  const workSpaceListOnlyName = workSpaceList.map((workSpace) => workSpace.wksp_name);
  const sourceList = workSpaceList.map((workSpace) => workSpace.wksp_src);
  const workspaceValue = workSpaceList.map((workspace) => workspace.wksp_name)[0];
  const indexSelecting = workSpaceListOnlyName.findIndex((workspaceName) => workspaceName === workspaceValue);

  const firstSource =
    indexSelecting !== -1 && sourceList[indexSelecting] ? sourceList[indexSelecting][0].src_name : '';
  const updateValues: blogFormType = {
    blog_tle: 'dwqdwq',
    blog_tag: ['apple', 'camera', 'def', 'workspaces'],
    blog_wksp: workspaceValue,
    blog_img: 'https://i1.sndcdn.com/avatars-000787434634-i9sqvl-t240x240.jpg',
    blog_cont: '<b>Hello</b>!',
    blog_src: firstSource
  };

  const handleCreateBlog = async (values: blogFormType) => {
    // console.log(values);

    let imageUrlResponse = '';

    if (values.blog_img && typeof values.blog_img !== 'string') {
      imageUrlResponse = await uploadImage(values.blog_img);
    }

    const filteredValues = filterFalsyFields({
      ...values,
      blog_img: imageUrlResponse || values.blog_img
    });

    await createBlog(filteredValues as blogFormType);
  };

  if (isPendingCreateBlog)
    return (
      <LoadingOverlay visible={isPendingCreateBlog} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
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
          workSpaceList={[]}
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
