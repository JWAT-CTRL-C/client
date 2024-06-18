import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogList from '@/components/workspaces/blogs/blogList';
import MemberList from '@/components/workspaces/memberList';
import NotificationList from '@/components/workspaces/notifications/notificationList';
import SourceList from '@/components/workspaces/sources/sourceList';
import { setContext } from '@/libs/api';
import { GET_SPECIFIC_WORKSPACE_KEY } from '@/libs/constants/queryKeys/workspace';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { getUserAuth } from '@/libs/utils';
import { getSpecificWorkspace } from '@/services/workspaceServices';
import { Divider, LoadingOverlay, Stack, Text, Tooltip } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEdit } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [GET_SPECIFIC_WORKSPACE_KEY + wksp_id],
    queryFn: async () => await getSpecificWorkspace(wksp_id),
    retry: 1
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
export default function Page() {
  const router = useRouter();
  const { workspace } = useFetchWorkspaceById(router.query.id as string);
  const { user_id } = getUserAuth();

  return (
    <div className='px-20 py-5'>
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
            {parseInt(user_id.toString() ?? '') === (workspace?.owner?.user_id ?? null) && (
              <Tooltip label='Edit workspace' color='black'>
                <Link className='mr-4 justify-self-end' href={`/workspaces/${router.query.id}/edit`}>
                  <FaEdit size={16} />
                </Link>
              </Tooltip>
            )}
          </div>
          <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
            <SourceList resources={workspace?.resources} />
            <BlogList />
            <NotificationList />
            <Divider />
            {workspace.users && <MemberList members={workspace.users} />}
          </Stack>
        </>
      )}
    </div>
  );
}
Page.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
