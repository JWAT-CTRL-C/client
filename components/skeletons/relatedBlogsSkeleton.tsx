import { Skeleton } from '@mantine/core';

export default function RelatedBlogsSkeleton() {
  return (
    <>
      <Skeleton height={50} width='70%' />
      <Skeleton height={400} />
      <Skeleton height={400} />
      <Skeleton height={400} />
      <Skeleton height={400} />
    </>
  );
}
