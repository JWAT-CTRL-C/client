import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogList from '@/components/workspaces/blogs/blogList';
import EditWorkspaceModal from '@/components/workspaces/editModal';
import NotificationList from '@/components/workspaces/notifications/notificationList';
import SourceList from '@/components/workspaces/sources/sourceList';
import { Button, Stack, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { FaEdit } from 'react-icons/fa';
const fakeData = {};
export default function Page() {
  const router = useRouter();
  const [opened,{toggle}] = useDisclosure(false);
  return (
    <div className='container'>
      <div className='grid'>
        <Tooltip label='Edit workspace' color='gray'>
          <Button className='mr-4 justify-self-end' variant='transparent' onClick={toggle}>
            <FaEdit size={16} />
          </Button>
        </Tooltip>
        <EditWorkspaceModal opened={opened} handleClose={toggle} />
      </div>
      <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
        <SourceList />
        <BlogList />
        <NotificationList />
      </Stack>
    </div>
  );
}
Page.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
