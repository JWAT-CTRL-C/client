import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogList from '@/components/workspaces/blogs/blogList';
import MemberList from '@/components/workspaces/memberList';
import NotificationList from '@/components/workspaces/notifications/notificationList';
import SourceList from '@/components/workspaces/sources/sourceList';
import { setContext } from '@/libs/api';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { preFetchSpecificWorkspace } from '@/libs/prefetchQueries/workspace';
import { getUserAuth } from '@/libs/utils';
import { NextPageWithLayout } from '@/pages/_app';
import { Can } from '@/providers/AbilityProvider';
import { Divider, LoadingOverlay, Stack, Text, Tooltip } from '@mantine/core';
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
  await prefetchMyInfo(queryClient);
  const isExist = await preFetchSpecificWorkspace(queryClient, wksp_id);
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
  const { user_id } = getUserAuth();
  const { user } = useMyInfo();

  useEffect(() => {
    const isUserInWorkspace = workspace?.users?.some((user) => user.user_id?.toString() === user_id);
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
            <div className='border-b pb-4'>
              <h1 className='py-1 text-2xl font-semibold uppercase'>{workspace?.wksp_name}</h1>
              <Text size='md'>{workspace?.wksp_desc}</Text>
            </div>
            {(parseInt(user_id.toString() ?? '') === (workspace?.owner?.user_id ?? null) ||
              ['MA', 'HM'].includes(user?.role ?? '')) && (
              <Can I='edit' a='workspace'>
                <Tooltip label='Edit workspace' color='black'>
                  <Link className='mr-4 justify-self-end' href={`/workspaces/${router.query.id}/edit`}>
                    <FaEdit size={16} />
                  </Link>
                </Tooltip>
              </Can>
            )}
          </div>
          <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
            <Divider my='xs' label='Resources' labelPosition='left' />
            <SourceList resources={workspace?.resources} />
            <Divider my='xs' label='Notifications' labelPosition='left' />
            <NotificationList notifications={[]} />
            <Divider my='xs' label='Blogs' labelPosition='left' />
            <BlogList blogs={workspace?.blogs} />

            <Divider />
            {workspace.users && <MemberList members={workspace.users} />}
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
