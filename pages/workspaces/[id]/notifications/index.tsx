import DefaultLayout from '@/components/layouts/DefaultLayout';
import NoData from '@/components/shared/EmptyData';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import RecentNotificationSkeleton from '@/components/skeletons/recentNotificationSkeleton';
import NotificationListItem from '@/components/workspaces/notifications/notificationListItem';
import { setContext } from '@/libs/api';
import { useRemoveNotification } from '@/libs/hooks/mutations/notiMutations';
import { useFetchWorkspaceNotifications } from '@/libs/hooks/queries/notiQueries';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { fetchSpecificWorkspace } from '@/libs/prefetchQueries/workspace';
import { NextPageWithLayout } from '@/pages/_app';
import { Checkbox, Loader, ScrollArea } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const queryClient = new QueryClient();
  const isExist = Promise.all([fetchSpecificWorkspace(queryClient, wksp_id), prefetchMyInfo(queryClient)]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    notFound: !isExist
  };
};
const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: wksp_id } = router.query;
  const [ref, inView] = useInView({ threshold: 0 });
  const [withoutSys, setWithoutSys] = useState(false);
  const { notifications, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchWorkspaceNotifications(wksp_id as string);
  const showListNoti = notifications?.filter((noti) => (withoutSys && !noti?.user ? null : noti));
  const { remove, isPending: removePending } = useRemoveNotification(wksp_id as string);
  const handleRemoveNotification = (noti_id: string) => {
    remove(noti_id, {
      onSuccess: (res) => {
        showSuccessToast(res.message);
      },
      onError: (err) => {
        if (isAxiosError(err)) {
          showErrorToast(err.response?.data.message);
        } else {
          showErrorToast(err.message);
        }
      }
    });
  };
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);
  if (isPending)
    return (
      <div className='grid w-full grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <RecentNotificationSkeleton key={index} />
        ))}
      </div>
    );

  if (_.isEmpty(notifications) || _.isNil(notifications)) return <NoData title='No notifications found' />;
  return (
    <>
      <Head>
        <title>Workspace - Notifications | Synergy</title>
        <meta name='description' content='Workspace - Notifications' />
      </Head>
      <div className='px-5 md:px-20'>
        <div className='flex-end w-full gap-3'>
          <Checkbox checked={withoutSys} onChange={() => setWithoutSys((prev) => !prev)} />
          <label>Without system notifications</label>
        </div>
        <div className='grid w-full grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3'>
          {showListNoti.length > 0
            ? showListNoti.map((notification) => {
                return (
                  <NotificationListItem
                    item={notification}
                    key={notification.noti_id}
                    enableEdit={true}
                    handleRemove={handleRemoveNotification}
                    removePending={removePending}
                  />
                );
              })
            : !isFetchingNextPage && (
                <div className='flex-center w-full sm:col-span-2 lg:col-span-3'>
                  <NoData title='No notifications found' />
                </div>
              )}
        </div>
        {hasNextPage && (
          <div ref={ref} className='flex-center my-3 w-full p-3'>
            {isFetchingNextPage && <Loader size={20} />}
          </div>
        )}
      </div>
    </>
  );
};
Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
