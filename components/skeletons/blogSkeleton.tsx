import { Divider, Flex, Skeleton } from '@mantine/core';

export default function BlogSkeleton() {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={'xl'} px={20} py={24} className='relative'>
      <Flex
        direction={'column'}
        className='pr-3'
        gap={'xl'}
        justify={'center'}
        flex={{ base: 'auto', lg: 8 }}>
        <Skeleton height={500} />

        <div className='flex-center w-full'>
          <Skeleton height={40} width={400} />
        </div>

        <Flex justify={'space-between'}>
          <Flex align='center' className='text-lg' gap={10}>
            <Skeleton height={40} circle />
            <Skeleton height={20} width={200} />
          </Flex>
          <Flex align='center' c={'green'} className='text-lg'>
            <Skeleton height={20} width={200} />
          </Flex>
        </Flex>

        <Flex direction={'column'} gap={'md'} wrap={'wrap'}>
          <Skeleton height={20} width={60} />
          <Flex gap={'sm'}>
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
          </Flex>
        </Flex>

        <Flex align={'center'} gap={10}>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={80} />
        </Flex>

        <Flex align={'center'} gap={10}>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={80} />
        </Flex>

        <Skeleton height={400} />

        <Divider />

        <Flex align={'center'} justify='start' gap={5}>
          <Flex justify='center' align={'center'} gap={5}>
            <Skeleton circle height={20} width={20} />
            <Skeleton circle height={20} width={20} />
          </Flex>
          <Flex justify='center' align={'center'} gap={5}>
            <Skeleton circle height={20} width={20} />
            <Skeleton circle height={20} width={20} />
          </Flex>
        </Flex>

        <Skeleton height={100} />

        <Skeleton height={40} width={100} />

        <Skeleton height={200} />
      </Flex>

      <Flex
        direction={'column'}
        gap={'xl'}
        w={'1/6'}
        className='top-4 h-full lg:sticky'
        flex={{ base: 'auto', md: 'auto', sm: 'auto', lg: 3 }}>
        <Skeleton height={50} width='70%' />
        <Skeleton height={400} />
        <Skeleton height={400} />
        <Skeleton height={400} />
        <Skeleton height={400} />
      </Flex>
    </Flex>
  );
}
