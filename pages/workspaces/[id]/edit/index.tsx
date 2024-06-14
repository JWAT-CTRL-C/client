import DefaultLayout from '@/components/layouts/DefaultLayout';
import EditGeneralWorkspaceForm from '@/components/workspaces/editGeneralForm';
import EditWorkspaceMemberForm from '@/components/workspaces/editMemberForm';
import { pushHash } from '@/libs/utils';
import { NextPageWithLayout } from '@/pages/_app';
import { NavLink, rem, ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { FaChevronLeft, FaCog, FaUsers } from 'react-icons/fa';

const EditWorkSpace: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = useState<string>('general');
  useEffect(() => {
    pushHash(activeTab);
  }, [activeTab]);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <div className='h-[84vh]'>
      <Tabs
        defaultValue={'general'}
        value={activeTab}
        orientation='vertical'
        h='100%'
        onChange={(value) => handleTabChange(value ?? 'general')}>
        <Tabs.List>
          <NavLink
            href={`/workspaces/${id}`}
            leftSection={<FaChevronLeft style={iconStyle} />}
            label=' Back to home'
            variant='filled'
            active
            color='violet'
          />
          <Tabs.Tab value='general' leftSection={<FaCog style={iconStyle} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value='collaborator' leftSection={<FaUsers style={iconStyle} />}>
            Collaborator
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='general' className='p-5'>
          <ScrollArea h={'100%'} scrollbars='y' scrollbarSize={2} scrollHideDelay={0}>
            <EditGeneralWorkspaceForm />
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value='collaborator' className='p-5'>
          <EditWorkspaceMemberForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
EditWorkSpace.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditWorkSpace;
