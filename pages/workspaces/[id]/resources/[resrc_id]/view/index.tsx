import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import NoData from '@/components/shared/EmptyData';
import BlogList from '@/components/workspaces/blogs/blogList';
import { setContext } from '@/libs/api';
import { useGetSpecificResource } from '@/libs/hooks/queries/resourceQueries';
import { preFetchSpecificResource } from '@/libs/prefetchQueries/resource';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { NextPageWithLayout } from '@/pages/_app';
import { Can } from '@/providers/AbilityProvider';
import { subject } from '@casl/ability';
import { Button, Divider, rem, Text } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { lazy, ReactElement, Suspense } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const wksp_id = context.query.id as string;
  const resrc_id = context.query.resrc_id as string;
  const queryClient = new QueryClient();
  const [isExist] = await Promise.all([
    preFetchSpecificResource(queryClient, wksp_id, resrc_id),
    prefetchMyInfo(queryClient)
  ]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    notFound: !isExist
  };
};
const ResourceViewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const wksp_id = router.query.id as string;
  const resrc_id = router.query.resrc_id as string;
  const { resource } = useGetSpecificResource(wksp_id, resrc_id);
  const Blog = lazy(() => import('@/components/resource/blogResource'));

  const handleCreateResourceBlog = () => {
    router.push(`/blogs/create?wksp_id=${wksp_id}&resrc_id=${resrc_id}`);
  };

  return (
    <div className='grid gap-3'>
      <div className='flex items-center gap-2'>
        <h1 className='py-1 pl-4 text-2xl font-semibold uppercase'>{resource.resrc_name}</h1>
        <Link
          href={resource.resrc_url}
          target='_blank'
          rel='noopener noreferrer'
          className='group transition-colors duration-300 hover:text-blue-500'>
          <FaExternalLinkAlt size={12} />
        </Link>
      </div>
      <Divider />
      <Suspense fallback={<Text>Loading...</Text>}>
        {_.isEmpty(resource.blog) ? (
          <div className='flex-center w-full flex-col'>
            <NoData title='No blog found' />
            <Can I='create' this={subject('resrc_blog', resource)}>
              <Button onClick={handleCreateResourceBlog} className='mt-4'>
                Add a blog to this resource
              </Button>
            </Can>
          </div>
        ) : (
          <Blog blog={resource.blog} />
        )}
      </Suspense>
    </div>
  );
};
ResourceViewPage.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default ResourceViewPage;