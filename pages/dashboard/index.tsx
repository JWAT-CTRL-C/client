import { GetServerSideProps } from 'next';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { Flex } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { NextPageWithLayout } from '../_app';
import RecentNotifications from '@/components/dashboard/Notifications/RecentNotifications';
import RecentlyJoinedWorkspaces from '@/components/dashboard/Workspaces/RecentlyJoinedWorkspaces';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await prefetchMyInfo(queryClient);

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
      <RecentlyJoinedWorkspaces />
    </Flex>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Dashboard;
