import BlogCompTable from '@/components/adminComp/blogCompTable';
import NotificationCompTable from '@/components/adminComp/notificationsCompTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { useFetchBlogsMasterAdmin } from '@/libs/hooks/queries/blogQueries';
import { useFetchNotificationsMasterAdmin } from '@/libs/hooks/queries/notiQueries';
import { prefetchMasterAdminBlogs } from '@/libs/prefetchQueries/blog';
import { prefetchNotificationsAdmin } from '@/libs/prefetchQueries/noti';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { BlogResponseWithPagination } from '@/libs/types/blogResponse';
import { NotificationResponseWithPagination } from '@/libs/types/notiType';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([prefetchMyInfo(queryClient), prefetchNotificationsAdmin(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const NotificationsAdminPage = () => {
  const [pageNotifications, setPageNotifications] = useState<number>(1);
  const {
    data: notifications,
    isError: isErrorNotifications,
    isLoading: isLoadingNotifications
  } = useFetchNotificationsMasterAdmin(pageNotifications);
  const handlePagingNotifications = (newPage: number) => {
    setPageNotifications(newPage);
  };

  return (
    <Can I='reach' a='NotificationsAdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <>
            <Head>
              <title>Notifications | Admin</title>
              <meta name='description' content='Admin-notifications' />
            </Head>
            <Flex direction='column' gap={3}>
              <div className='mb-3'>
                <NotificationCompTable
                  currentPage={pageNotifications}
                  dataTable={notifications as NotificationResponseWithPagination}
                  onPagination={handlePagingNotifications}
                  isLoading={isLoadingNotifications}
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

export default NotificationsAdminPage;

NotificationsAdminPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
