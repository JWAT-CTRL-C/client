import DefaultLayout from '@/components/layouts/DefaultLayout';
import CreateWorkspaceForm from '@/components/workspaces/createForm';
import WorkspaceList from '@/components/workspaces/workspaceList';
import { getUserAuth } from '@/libs/utils';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaPlusCircle } from 'react-icons/fa';

export default function Workspace() {
  const [opened, { toggle }] = useDisclosure(false);
  const user_id = getUserAuth().user_id;
  return (
    <div className='grid justify-items-center gap-4 p-2'>
      <div className='grid w-full grid-cols-2'>
        <p className='pl-10 text-2xl font-semibold uppercase'>Workspaces</p>
        <Button onClick={toggle} className='justify-self-end' leftSection={<FaPlusCircle />}>
          New Workspace
        </Button>
        <CreateWorkspaceForm opened={opened} handleClose={toggle} />
      </div>
      <WorkspaceList />
    </div>
  );
}
Workspace.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
