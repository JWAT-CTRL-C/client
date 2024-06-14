import DefaultLayout from '@/components/layouts/DefaultLayout';
import BlogList from '@/components/workspaces/blogs/blogList';
import NotificationList from '@/components/workspaces/notifications/notificationList';
import SourceList from '@/components/workspaces/sources/sourceList';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { getUserAuth } from '@/libs/utils';
import { Stack, Text, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEdit } from 'react-icons/fa';
export default function Page() {
  const router = useRouter();
  const { workspace } = useFetchWorkspaceById(router.query.id as string);
  const user_id = getUserAuth().user_id;
  return (
    <div className='px-20 py-5'>
      <div className='grid gap-3'>
        <div className='border-b pb-4'>
          <h1 className='py-1 text-2xl font-semibold uppercase'>{workspace?.wksp_name}</h1>
          <Text size='md'>{workspace?.wksp_desc}</Text>
        </div>
        {parseInt(user_id) === workspace?.owner.user_id && (
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
      </Stack>
    </div>
  );
}
Page.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
