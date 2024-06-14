import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useFetchBlogsCurrentUser } from '@/libs/hooks/queries/blogQueries';
import { blogCommentType } from '@/libs/types/blogCommentType';
import { blogRatingType } from '@/libs/types/blogRatingType';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { transformBlogTableType } from '@/libs/utils';
import { fetchBlogsForCurrentUser } from '@/services/blogServices';
import { Flex, LoadingOverlay } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

// export const getServerSideProps: GetServerSideProps = async () => {
//   const queryClient = new QueryClient();

//   try {
//     await queryClient.prefetchQuery({
//       queryKey: ['blogs-current-user'],
//       queryFn: async () => await fetchBlogsForCurrentUser()
//     });
//   } catch (error) {
//     console.error('Error prefetching blogs:', error);
//   }

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient)
//     }
//   };
// };
const YourBlog = () => {
  const { data: blogs, isLoading, isError } = useFetchBlogsCurrentUser();
  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;

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
