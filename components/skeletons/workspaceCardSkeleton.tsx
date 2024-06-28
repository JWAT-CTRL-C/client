import { cn } from '@/libs/utils';
import { Avatar, Card, Skeleton } from '@mantine/core';

export default function WorkspaceCardSkeleton() {
  return (
    <Card
      shadow='sm'
      padding='lg'
      radius='md'
      className={cn('min-w-80 hover:cursor-pointer hover:shadow-lg', 'md:min-w-[33%] lg:min-w-[30%]')}>
      <Card.Section>
        <Skeleton height={200} />
      </Card.Section>

      <Skeleton mt={5} height={20} width={200} />

      <Skeleton mt={5} height={20} width={300} />
      <Avatar.Group className='mt-2' spacing='xs'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} circle height={30} width={30} />
        ))}
      </Avatar.Group>
    </Card>
  );
}
