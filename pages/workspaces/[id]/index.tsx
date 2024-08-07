import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import WorkspaceSkeleton from '@/components/skeletons/workspaceSkeleton';
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
import { Divider, Spoiler, Stack } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { prefetchWorkspaceBlogs } from '@/libs/prefetchQueries/blog';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const queryClient = new QueryClient();
  const isExist = await Promise.all([
    fetchSpecificWorkspace(queryClient, wksp_id),
    prefetchMyInfo(queryClient),
    prefetchWorkspaceBlogs(queryClient, wksp_id)
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
    const isUserInWorkspace = workspace?.users?.some((user) => user.user_id === user.user_id);
    if (!isUserInWorkspace && !['MA', 'HM'].includes(user?.role ?? '')) {
      router.push('/workspaces');
    }
  }, [workspace]);
  return _.isEmpty(workspace) ? (
    <>
      <Head>
        <title>Loading... | Synergy</title>
        <meta name='description' content='Loading...' />
      </Head>

      <WorkspaceSkeleton />
    </>
  ) : (
    <>
      <Head>
        <title>
          {workspace.wksp_name.slice(0, 20) + (workspace.wksp_name.length > 20 ? '...' : '') ?? 'Blog'} |
          Synergy
        </title>
        <meta name='description' content={workspace.wksp_name.slice(0, 20) ?? 'Blog'} />
      </Head>

      <div className='px-5 py-2 md:px-20'>
        <div className='flex-between'>
          <div className='pb-4'>
            <h1 className='mb-3 py-1 text-2xl font-semibold uppercase'>{workspace?.wksp_name}</h1>
            <Spoiler
              showLabel='Show more'
              hideLabel='Show less'
              transitionDuration={200}
              className='pl-3 text-sm'
              classNames={{
                control: 'text-xs'
              }}
              maxHeight={20}
              c='gray.7'>
              {workspace?.wksp_desc}
            </Spoiler>
          </div>
          {/* <Can I='edit' this={subject('workspace', workspace)}>
            <Tooltip label='Edit workspace' color='black' withArrow>
              <Link
                className='mr-4 flex items-center gap-3 justify-self-end rounded-md border-0 bg-violet-700 bg-opacity-75 px-4 py-2 text-white'
                href={`/workspaces/${router.query.id}/edit`}>
                <FaEdit size={16} />
                <span className='hidden md:inline'>Edit</span>
              </Link>
            </Tooltip>
          </Can> */}
        </div>
        <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
          <Divider label='Resources' labelPosition='left' />
          <SourceList resources={workspace?.resources} />
          <Divider label='Notifications' labelPosition='left' />
          <NotificationList />
          <Divider label='Blogs' labelPosition='left' />
          <BlogList />
          <Divider />
          <MemberList members={workspace?.users} />
        </Stack>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
