import DefaultLayout from '@/components/layouts/DefaultLayout';
import CreateWorkspaceForm from '@/components/workspaces/createForm';
import WorkspaceList from '@/components/workspaces/worspaceList';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaPlusCircle } from 'react-icons/fa';

export default function Workspace() {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className='grid justify-items-center gap-4 p-2'>
      <div className='grid w-full grid-cols-2'>
        <p className='pl-10 text-2xl font-semibold uppercase'>Workspaces</p>
        <Button onClick={toggle} className='justify-self-end' leftSection={<FaPlusCircle />}>
          New Workspace
        </Button>
      </div>
      <CreateWorkspaceForm opened={opened} handleClose={toggle} />
      <WorkspaceList />
    </div>
  );
}
Workspace.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
