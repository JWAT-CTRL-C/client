import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { blogCommentType } from '@/libs/types/blogCommentType';
import { blogRatingType } from '@/libs/types/blogRatingType';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { transformBlogTableType } from '@/libs/utils';
import { fetchBlogsForCurrentUser } from '@/services/blogServices';
import { Flex } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['blogs-curent-user'],
      queryFn: async () => await fetchBlogsForCurrentUser()
    });
  } catch (error) {
    console.error('Error prefetching blogs:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
const YourBlog = () => {
  // const fakeTags: Tag[] = [
  //   { tag_id: 1, tag_name: 'React', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' },
  //   {
  //     tag_id: 2,
  //     tag_name: 'Angular',
  //     crd_at: '2024-06-05T23:26:40.692Z',
  //     upd_at: '2024-06-05T23:26:40.692Z'
  //   },
  //   { tag_id: 3, tag_name: 'Vue', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' },
  //   { tag_id: 4, tag_name: 'Svelte', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' }
  // ];

  const { data: blogs, isLoading, isError } = useFetchBlogsCurrentUser();

  return (
    <Flex>
      <BlogTable dataTable={blogs ? transformBlogTableType(blogs) : []} />
    </Flex>
  );
};

export default YourBlog;

YourBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
