import DefaultLayout from '@/components/layouts/DefaultLayout';
import DangerZone from '@/components/workspaces/dangerZone';
import EditGeneralWorkspaceForm from '@/components/workspaces/editGeneralForm';
import EditWorkspaceMemberForm from '@/components/workspaces/editMemberForm';
import { setContext } from '@/libs/api';
import { useGetAllResourcesByWorkspace } from '@/libs/hooks/queries/resourceQueries';
import { useGetAllUsers, useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useFetchWorkspaceById, useGetWorkspaceMember } from '@/libs/hooks/queries/workspaceQueries';
import { preFetchAllResources } from '@/libs/prefetchQueries/resource';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import {
  preFetchAllUser,
  preFetchAllWorkspaceMembers,
  fetchSpecificWorkspace
} from '@/libs/prefetchQueries/workspace';
import { User } from '@/libs/types/userType';
import { pushHash } from '@/libs/utils';
import { NextPageWithLayout } from '@/pages/_app';
import { Box, Divider, Flex, Loader, rem, ScrollArea, Tabs } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { FaBan, FaChevronLeft, FaCog, FaUsers } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const queryClient = new QueryClient();
  const [isExist] = await Promise.all([
    fetchSpecificWorkspace(queryClient, wksp_id),
    preFetchAllResources(queryClient, wksp_id),
    preFetchAllUser(queryClient),
    preFetchAllWorkspaceMembers(queryClient, wksp_id),
    prefetchMyInfo(queryClient)
  ]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    notFound: !isExist
  };
};

const EditWorkSpace: NextPageWithLayout = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = useState<string>('general');
  const router = useRouter();
  const wksp_id = router.query.id as string;
  const { workspace, isFetching } = useFetchWorkspaceById(wksp_id);
  const { resources } = useGetAllResourcesByWorkspace(wksp_id);
  const { users } = useGetAllUsers();
  const { members } = useGetWorkspaceMember(wksp_id);
  const { user } = useMyInfo();

  useEffect(() => {
    if (!_.isEmpty(workspace)) {
      if (workspace.owner.user_id !== user?.user_id && !['MA', 'HM'].includes(user?.role ?? '')) {
        router.replace('https://youtu.be/watch_popup?v=Ts2Nv8z0lo4');
      }
    }
  }, []);
  useEffect(() => {
    if (router.pathname.startsWith('/workspaces/[id]/edit')) {
      pushHash(activeTab);
    }
    return () => {
      pushHash('');
    };
  }, [activeTab]);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return _.isEmpty(workspace) || isFetching ? (
    <div className='flex h-full w-full items-center justify-center'>
      <Loader />
    </div>
  ) : (
    <>
      <Head>
        <title>Edit workspace | Synergy</title>
        <meta name='description' content='Edit workspace' />
      </Head>

      <div className='h-[84vh]'>
        <Tabs
          defaultValue={'general'}
          value={activeTab}
          orientation='vertical'
          h='100%'
          onChange={(value) => handleTabChange(value ?? 'general')}>
          <Tabs.List>
            <Link href={`/workspaces/${wksp_id}`} className={`pr-3 hover:text-gray-500`}>
              <Flex mih={50} gap='md' justify='flex-start' align='center' direction='row' wrap='wrap'>
                <Box>
                  <FaChevronLeft style={iconStyle} />
                </Box>
                <Box>Back to home</Box>
              </Flex>
            </Link>
            <Divider />
            <Tabs.Tab value='general' leftSection={<FaCog style={iconStyle} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value='collaborator' leftSection={<FaUsers style={iconStyle} />}>
              Collaborator
            </Tabs.Tab>
            <Tabs.Tab value='danger-zone' c='red.5' leftSection={<FaBan style={iconStyle} />}>
              Danger zone
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='general' className='p-5'>
            <ScrollArea h={'100%'} scrollbars='y' scrollbarSize={2} scrollHideDelay={0}>
              <EditGeneralWorkspaceForm workspace={workspace} resources={resources} />
            </ScrollArea>
          </Tabs.Panel>
          <Tabs.Panel value='collaborator' className='p-5'>
            <EditWorkspaceMemberForm members={members} users={users} currentUser={user ?? ({} as User)} />
          </Tabs.Panel>
          <Tabs.Panel value='danger-zone' className='p-5'>
            <DangerZone wksp_id={wksp_id} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};
EditWorkSpace.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditWorkSpace;
