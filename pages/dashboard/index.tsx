import { GetServerSideProps } from 'next';

import RecentNotifications from '@/components/dashboard/Notifications/RecentNotifications';
import RecentJoinedWorkspaces from '@/components/dashboard/Workspaces/RecentJoinedWorkspaces';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { prefetchRecentWorkspaces } from '@/libs/prefetchQueries/workspace';
import { Flex } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { NextPageWithLayout } from '../_app';
import RecentBlogs from '@/components/dashboard/BLogs/RecentBlogs';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await Promise.all([prefetchMyInfo(queryClient), prefetchRecentWorkspaces(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const Dashboard: NextPageWithLayout = () => {
  return (
    <Flex direction='column' gap={3} p={8}>
      <h1 className='text-2xl font-semibold'>Recent Notifications</h1>
      <RecentNotifications />

      <h1 className='text-2xl font-semibold'>Recently Joined Workspaces</h1>
      <RecentJoinedWorkspaces />

      <h1 className='text-2xl font-semibold'>Recent Blogs</h1>
      <RecentBlogs />
    </Flex>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Dashboard;
