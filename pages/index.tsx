import { setContext } from '@/libs/api';
import { MY_INFO_KEY } from '@/libs/constants/queryKeys/user';
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
    queryKey: [MY_INFO_KEY],
    queryFn: async () => await fetchUserById('me')
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
