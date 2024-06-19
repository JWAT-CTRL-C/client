import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Flex } from '@mantine/core';
import { NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  return (
    <Flex direction='column' gap={3}>
      Dashboard
    </Flex>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Dashboard;
