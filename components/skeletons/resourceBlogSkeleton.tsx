import { Divider, Flex, Skeleton } from '@mantine/core';

export const ResourceBlogSkeleton = () => {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap='xl' px={20} py={24} className='relative'>
      <Flex direction='column' className='pr-3' gap='xl' justify='center' flex={{ base: 'auto', lg: 8 }}>
        <Skeleton height={50} />
        <Divider />
        <Skeleton height={500} />

        <div className='flex-center w-full'>
          <Skeleton height={40} width={400} />
        </div>

        <Flex justify='space-between'>
          <Flex align='center' className='text-lg' gap={10}>
            <Skeleton height={40} circle />
            <Skeleton height={20} width={200} />
          </Flex>
          <Flex align='center' c='green' className='text-lg'>
            <Skeleton height={20} width={200} />
          </Flex>
        </Flex>

        <Flex direction='column' gap='md' wrap='wrap'>
          <Skeleton height={20} width={60} />
          <Flex gap='sm'>
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
          </Flex>
        </Flex>

        <Flex align='center' gap={10}>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={80} />
        </Flex>

        <Flex align='center' gap={10}>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={80} />
        </Flex>

        <Skeleton height={400} />
      </Flex>
    </Flex>
  );
};
