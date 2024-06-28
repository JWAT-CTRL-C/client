import { GetServerSideProps } from 'next';

import DefaultLayout from '@/components/layouts/DefaultLayout';
import { setContext } from '@/libs/api';
import { prefetchMyInfo, prefetchUsersAdmin } from '@/libs/prefetchQueries/user';
import { Can } from '@/providers/AbilityProvider';
import { Flex } from '@mantine/core';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import { NextPageWithLayout } from '../_app';
import { useState } from 'react';
import { useGetAllUsersForAdmin } from '@/libs/hooks/queries/userQueries';
import UserCompTable from '@/components/adminComp/usersCompTable';
import { UserResponseWithPagination } from '@/libs/types/userType';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);

  const queryClient = new QueryClient();
  await Promise.all([prefetchMyInfo(queryClient), prefetchUsersAdmin(queryClient)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const AdminPage: NextPageWithLayout = () => {
  const [page, setPage] = useState<number>(1);
  const { users, isError, isPending } = useGetAllUsersForAdmin(page);
  const handlePaging = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Can I='reach' a='AdminPage' passThrough>
      {(allowed) =>
        allowed ? (
          <Flex direction='column' gap={3}>
            <div className='mb-3'>
              <UserCompTable
                currentPage={page}
                dataTable={users as UserResponseWithPagination}
                onPagination={handlePaging}
                isLoading={isPending}
              />
            </div>
          </Flex>
        ) : (
          <Flex direction='column' gap={3}>
            You are not allowed to access this page
          </Flex>
        )
      }
    </Can>
  );
};

AdminPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AdminPage;
