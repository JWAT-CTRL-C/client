import { GetServerSideProps } from 'next';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { NextPageWithLayout } from '../_app';

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

const AdminPage: NextPageWithLayout = () => {
  return (
    <Can I='reach' a='AdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <Flex direction='column' gap={3}>
            AdminPage
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
