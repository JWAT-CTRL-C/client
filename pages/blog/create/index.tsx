import BlogForm from '@/components/blogForm';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { blogFormType } from '@/libs/types/blogFormType';
import { workspacesType } from '@/libs/types/workspacesType';
import { Center, Flex, Group, Title } from '@mantine/core';

const CreateBlog = () => {
  const workSpaceList: workspacesType[] = [
    {
      workspaceId: 'ws1',
      workspaceName: 'Workspace 1',
      workspaceDes: 'Description for Workspace 1',
      sources: [
        {
          sourceId: 'src1',
          sourceUrl: 'http://example.com/source1',
          sourceName: 'Source 1'
        },
        {
          sourceId: 'src2',
          sourceUrl: 'http://example.com/source2',
          sourceName: 'Source 2'
        }
      ]
    },
    {
      workspaceId: 'ws2',
      workspaceName: 'Workspace 2',
      workspaceDes: 'Description for Workspace 2',
      sources: [
        {
          sourceId: 'src3',
          sourceUrl: 'http://example.com/source3',
          sourceName: 'Source 3'
        },
        {
          sourceId: 'src4',
          sourceUrl: 'http://example.com/source4',
          sourceName: 'Source 4'
        }
      ]
    },
    {
      workspaceId: 'ws3',
      workspaceName: 'Workspace 3',
      workspaceDes: 'Description for Workspace 3',
      sources: [
        {
          sourceId: 'src5',
          sourceUrl: 'http://example.com/source5',
          sourceName: 'Source 5'
        },
        {
          sourceId: 'src6',
          sourceUrl: 'http://example.com/source6',
          sourceName: 'Source 6'
        }
      ]
    }
  ];
  const workSpaceListOnlyName = workSpaceList.map((workSpace) => workSpace.workspaceName);
  const sourceList = workSpaceList.map((workSpace) => workSpace.sources);
  const workspaceValue = workSpaceList.map((workspace) => workspace.workspaceName)[0];
  const indexSelecting = workSpaceListOnlyName.findIndex((workspaceName) => workspaceName === workspaceValue);

  const firstSource =
    indexSelecting !== -1 && sourceList[indexSelecting] ? sourceList[indexSelecting][0].sourceName : '';

  const updateValues = {
    title: 'dwqdwq',
    tag: ['apple', 'camera', 'def'] as string[],
    workspace: workspaceValue,
    backgroundImg: 'https://i1.sndcdn.com/avatars-000787434634-i9sqvl-t240x240.jpg',
    content: '<b>Hello</b>!',
    source: firstSource
  };

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
          //isEditing
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
