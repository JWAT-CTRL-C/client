import DefaultLayout from '@/components/layouts/DefaultLayout';
import CreateWorkspaceForm from '@/components/workspaces/createForm';
import WorkspaceList from '@/components/workspaces/workspaceList';
import { setContext } from '@/libs/api';
import { Can } from '@/providers/AbilityProvider';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { NextPageWithLayout } from '../_app';
import { preFetchMyWorkspace } from '@/libs/prefetchQueries/workspace';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([preFetchMyWorkspace(queryClient), prefetchMyInfo(queryClient)]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
const Workspace: NextPageWithLayout = () => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className='grid justify-items-center gap-4 p-2'>
      <div className='grid w-full grid-cols-2 gap-3'>
        <p className='pl-10 text-2xl font-semibold uppercase'>Workspaces</p>
        <Can I='create' a='workspace'>
          <Button onClick={toggle} className='justify-self-end'>
            <FaPlusCircle />
            <span className='ml-2 hidden md:inline'>New Workspace</span>
          </Button>
        </Can>
        <CreateWorkspaceForm opened={opened} handleClose={toggle} />
      </div>
      <WorkspaceList />
    </div>
  );
};
Workspace.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Workspace;
