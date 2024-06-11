import DefaultLayout from '@/components/layouts/DefaultLayout';
import { QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';


// export async function getServerSideProps() {
//   const queryClient = new QueryClient();

//   try {
//     await queryClient.prefetchQuery({
//       queryKey: ['blogs'],
//       queryFn: fetchBlogs
//     });
//   } catch (error) {
//     console.error('Error prefetching blogs:', error);
//   }

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient)
//     }
//   };
// }




const BlogInfo = () => {
  const router = useRouter();
  return <div>{router.query.id}</div>;
};

export default BlogInfo;

BlogInfo.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
