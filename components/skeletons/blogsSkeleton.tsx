import { Card, Divider, Group, Image, SimpleGrid, Skeleton } from '@mantine/core';

export default function BlogsSkeleton() {
  return (
    <SimpleGrid
      className='px-10 py-12'
      cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
      spacing={{ base: 5, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className='flex h-full w-full cursor-pointer justify-between'
          shadow='sm'
          padding='lg'
          radius='md'
          withBorder>
          <Card.Section mb='sm'>
            <Skeleton height={200} />
          </Card.Section>

          <Group className='flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap'>
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={80} />
          </Group>

          <Group mt='lg'>
            <Skeleton height={20} width={400} />
          </Group>

          <Group mt='lg' className='w-full'>
            <Skeleton circle height={40} width={40} />
            <div className='space-y-1'>
              <Skeleton height={20} width={200} />
              <Skeleton height={20} width={120} />
            </div>
          </Group>

          <Card.Section my='sm'>
            <Divider />
          </Card.Section>

          <Group justify='space-between'>
            <Skeleton height={20} width={120} />
            <Group gap={0}>
              <Skeleton circle height={20} width={20} />
            </Group>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
