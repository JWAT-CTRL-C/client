import { GetServerSideProps } from 'next';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { NextPageWithLayout } from '../_app';
import { useFetchBlogsMasterAdmin } from '@/libs/hooks/queries/blogQueries';
import { prefetchMasterAdminBlogs } from '@/libs/prefetchQueries/blog';
import { useState } from 'react';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import BlogCompTable from '@/components/adminComp/blogCompTable';
import { useGetWorkspaceForMasterAdmin } from '@/libs/hooks/queries/workspaceQueries';
import { preFetchAllWorkspaceMasterAdmin } from '@/libs/prefetchQueries/workspace';
import WorkspaceCompTable from '@/components/adminComp/workspacesCompTable';
import { WorkspacesResponseWithPagination } from '@/libs/types/workspacesType';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([
    prefetchMyInfo(queryClient),
    prefetchMasterAdminBlogs(queryClient),
    preFetchAllWorkspaceMasterAdmin(queryClient)
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const AdminPage: NextPageWithLayout = () => {
  const [pageBlogs, setPageBlogs] = useState<number>(1);
  const [pageWorkspaces, setPageWorkspaces] = useState<number>(1);

  const {
    data: blogs,
    isError: isErrorBlogs,
    isLoading: isLoadingBlogs
  } = useFetchBlogsMasterAdmin(pageBlogs);
  const {
    workspaces,
    isError: isErrorWorkspaces,
    isPending: isLoadingWorkspaces
  } = useGetWorkspaceForMasterAdmin(pageWorkspaces);

  const handlePagingBlogs = (newPage: number) => {
    setPageBlogs(newPage);
  };
  const handlePagingWorkspaces = (newPage: number) => {
    setPageWorkspaces(newPage);
  };
  console.log(workspaces);

  return (
    <Can I='reach' a='AdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <Flex direction='column' gap={3}>
            AdminPage
            <div className='mb-3'>
              <BlogCompTable
                currentPage={pageBlogs}
                dataTable={blogs as BlogResponseWithPagination}
                onPagination={handlePagingBlogs}
                isLoading={isLoadingBlogs}
              />
            </div>
            <div className='mb-3'>
              <WorkspaceCompTable
                currentPage={pageWorkspaces}
                dataTable={workspaces as WorkspacesResponseWithPagination}
                onPagination={handlePagingWorkspaces}
                isLoading={isLoadingWorkspaces}
              />
            </div>
          </Flex>
        ) : (
          <Flex direction='column' gap={3}>
            You are not allowed to access this page
          </Flex>
        )
      }
    </Can>
  );
};

AdminPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AdminPage;
