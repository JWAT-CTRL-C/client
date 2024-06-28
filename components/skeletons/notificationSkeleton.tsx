import { Skeleton } from '@mantine/core';

const NotificationSkeleton = () => (
  <>
    <Skeleton height={120} radius='xl' />
    <Skeleton height={120} mt={6} radius='xl' />
    <Skeleton height={120} mt={6} width='70%' radius='xl' />
  </>
);
export default NotificationSkeleton;