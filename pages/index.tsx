import { setContext } from '@/libs/api';
import { fetchUserById } from '@/services/userServices';
import { LoadingOverlay } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

export default function Home() {
  return <LoadingOverlay visible />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['myInfo'],
    queryFn: () => fetchUserById('me'),
    retry: 1
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
