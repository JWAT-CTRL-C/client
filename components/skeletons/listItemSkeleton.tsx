import { Skeleton } from '@mantine/core';

const ListItemSkeleton = () => (
  <>
    <Skeleton height={8} radius='xl' />
    <Skeleton height={8} mt={6} radius='xl' />
    <Skeleton height={8} mt={6} width='70%' radius='xl' />
  </>
);
export default ListItemSkeleton;
