import { setContext } from '@/libs/api';
import { prefetchMyInfo } from '@/libs/prefetchQueries/user';
import { LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

export default function Home() {
  return <LoadingOverlay visible />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await prefetchMyInfo(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    redirect: {
      destination: '/dashboard',
      permanent: true
    }
  };
};
