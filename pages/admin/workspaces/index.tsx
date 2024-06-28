import BlogCompTable from '@/components/adminComp/blogCompTable';
import WorkspaceCompTable from '@/components/adminComp/workspacesCompTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsMasterAdmin } from '@/libs/hooks/queries/blogQueries';
import { useGetWorkspaceForMasterAdmin } from '@/libs/hooks/queries/workspaceQueries';
import { prefetchMasterAdminBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { preFetchAllWorkspaceMasterAdmin } from '@/libs/prefetchQueries/workspace';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { WorkspacesResponseWithPagination } from '@/libs/types/workspacesType';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([prefetchMyInfo(queryClient), preFetchAllWorkspaceMasterAdmin(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const WorkspacesAdminPage = () => {
  const [pageWorkspaces, setPageWorkspaces] = useState<number>(1);
  const {
    workspaces,
    isError: isErrorWorkspaces,
    isPending: isLoadingWorkspaces
  } = useGetWorkspaceForMasterAdmin(pageWorkspaces);

  const handlePagingWorkspaces = (newPage: number) => {
    setPageWorkspaces(newPage);
  };

  return (
    <Can I='reach' a='WorkspacesAdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <>
            <Head>
              <title>Workspace | Admin</title>
              <meta name='description' content='Admin-workspaces' />
            </Head>
            <Flex direction='column' gap={3}>
              <div className='mb-3'>
                <WorkspaceCompTable
                  currentPage={pageWorkspaces}
                  dataTable={workspaces as WorkspacesResponseWithPagination}
                  onPagination={handlePagingWorkspaces}
                  isLoading={isLoadingWorkspaces}
                />
              </div>
            </Flex>
          </>
        ) : (
          <Flex direction='column' gap={3}>
            You are not allowed to access this page
          </Flex>
        )
      }
    </Can>
  );
};

export default WorkspacesAdminPage;

WorkspacesAdminPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
