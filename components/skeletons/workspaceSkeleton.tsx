import { Box, Card, Divider, Flex, Group, Skeleton, Stack } from '@mantine/core';

export default function WorkspaceSkeleton() {
  return (
    <div className='px-5 py-2 md:px-20'>
      <div className='flex-between'>
        <div className='space-y-2 pb-4'>
          <Skeleton height={30} width={200} />

          <Skeleton height={20} width={300} />
        </div>
      </div>
      <Stack h={300} bg='var(--mantine-color-body)' align='stretch' justify='flex-start' gap='xl'>
        <Divider label='Resources' labelPosition='left' />
        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='col-span-1 space-y-2 overflow-hidden rounded-md bg-muted px-3 py-2 hover:cursor-pointer sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 xl:px-8 xl:py-6 2xl:px-10 2xl:py-7'>
              <Skeleton height={20} width={200} />

              <Skeleton height={20} width={100} />
            </div>
          ))}
        </Box>

        <Divider label='Notifications' labelPosition='left' />

        <div className='rounded-lg bg-neutral-50 py-2 dark:bg-neutral-800'>
          <div className='grid w-full grid-cols-2 gap-3 px-4 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='mt-4 w-full rounded-xl bg-muted p-5 pb-7 shadow-md'>
                <div className='flex-start mb-3 gap-4'>
                  <Skeleton circle height={50} width={50} />

                  <div className='space-y-2 text-xs text-slate-500'>
                    <Skeleton height={20} width={100} />
                    <Skeleton radius='lg' height={20} width={70} />
                  </div>
                </div>
                <Divider size='xs' />
                <div className='mt-2 grid gap-2 pl-[8%]'>
                  <Skeleton height={20} width={200} />
                  <Skeleton height={20} width={100} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider label='Blogs' labelPosition='left' />
        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
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
        </Box>
        <Divider />
        <Flex mih={50} gap='lg' justify='flex-start' align='flex-start' direction='row' wrap='wrap'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton circle height={50} width={50} key={index} />
          ))}
        </Flex>
      </Stack>
    </div>
  );
}
