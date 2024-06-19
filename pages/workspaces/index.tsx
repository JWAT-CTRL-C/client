import DefaultLayout from '@/components/layouts/DefaultLayout';
import CreateWorkspaceForm from '@/components/workspaces/createForm';
import WorkspaceList from '@/components/workspaces/workspaceList';
import { setContext } from '@/libs/api';
import { GET_ALL_WORKSPACES_BY_USER_KEY } from '@/libs/constants/queryKeys/workspace';
import { Can } from '@/providers/AbilityProvider';
import { getWorkspacesByUser } from '@/services/workspaceServices';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY],
    queryFn: async () => await getWorkspacesByUser()
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
export default function Workspace() {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className='grid justify-items-center gap-4 p-2'>
      <div className='grid w-full grid-cols-2'>
        <p className='pl-10 text-2xl font-semibold uppercase'>Workspaces</p>
        <Can I='create' a='Workspace'>
          <Button onClick={toggle} className='justify-self-end' leftSection={<FaPlusCircle />}>
            New Workspace
          </Button>
        </Can>
        <CreateWorkspaceForm opened={opened} handleClose={toggle} />
      </div>
      <WorkspaceList />
    </div>
  );
}
Workspace.getLayout = function getLayout(page: ReactNode) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
