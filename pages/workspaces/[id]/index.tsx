import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogList from '@/components/workspaces/blogs/blogList';
import MemberList from '@/components/workspaces/memberList';
import NotificationList from '@/components/workspaces/notifications/notificationList';
import SourceList from '@/components/workspaces/sources/sourceList';
import { setContext } from '@/libs/api';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { fetchSpecificWorkspace } from '@/libs/prefetchQueries/workspace';
import { NextPageWithLayout } from '@/pages/_app';
import { Can } from '@/providers/AbilityProvider';
import { Divider, LoadingOverlay, Spoiler, Stack, Text, Tooltip } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const queryClient = new QueryClient();
  const isExist = await Promise.all([
    fetchSpecificWorkspace(queryClient, wksp_id),
    prefetchMyInfo(queryClient)
  ]).then((res) => res[0]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    notFound: !isExist
  };
};
const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { workspace } = useFetchWorkspaceById(router.query.id as string);
  const { user } = useMyInfo();

  useEffect(() => {
    const isUserInWorkspace = workspace?.users?.some((user) => user.user_id?.toString() === user.user_id);
    if (!isUserInWorkspace && !['MA', 'HM'].includes(user?.role ?? '')) {
      router.push('/workspaces');
    }
  }, [workspace]);
  return (
    <div className='px-5 py-2 md:px-20'>
      {_.isEmpty(workspace) ? (
        <LoadingOverlay
          visible={_.isEmpty(workspace)}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      ) : (
        <>
          <div className='grid gap-3'>
            <div className='pb-4'>
              <h1 className='mb-3 py-1 text-2xl font-semibold uppercase'>{workspace?.wksp_name}</h1>
              <Spoiler
                showLabel='Show more'
                hideLabel='Hide'
                transitionDuration={200}
                className='pl-3 text-sm'
                maxHeight={20}
                maw={'80%'}
                c='gray.7'>
                {workspace?.wksp_desc}
              </Spoiler>
            </div>
            {(user?.user_id === (workspace?.owner?.user_id ?? null) ||
              ['MA', 'HM'].includes(user?.role ?? '')) && (
              <Can I='edit' a='workspace'>
                <Tooltip label='Edit workspace' color='black' withArrow>
                  <Link
                    className='mr-4 flex items-center gap-3 justify-self-end rounded-md border-0 bg-violet-700 bg-opacity-75 px-4 py-2 text-white'
                    href={`/workspaces/${router.query.id}/edit`}>
                    <FaEdit size={16} />
                    <span className='hidden md:inline'>Edit</span>
                  </Link>
                </Tooltip>
              </Can>
            )}
          </div>
          <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
            <Divider my='xs' label='Resources' labelPosition='left' />
            <SourceList resources={workspace?.resources} />
            <Divider my='xs' label='Notifications' labelPosition='left' />
            <NotificationList notifications={workspace?.notifications} />
            <Divider my='xs' label='Blogs' labelPosition='left' />
            <BlogList blogs={workspace?.blogs} />
            <Divider />
            <MemberList members={workspace?.users} />
          </Stack>
        </>
      )}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
