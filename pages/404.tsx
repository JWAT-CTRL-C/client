import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import { useRouter } from 'next/router';

export default function NotFoundImage() {
  const router = useRouter();
  return (
    <Container className='flex-center h-dvh'>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src='/images/404.svg' className='md:hidden' />
        <div>
          <Title className='mb-[var(--mantine-spacing-md)] text-4xl font-black max-sm:text-3xl'>
            Something is not right...
          </Title>
          <Text c='dimmed' size='lg'>
            Page you are trying to open does not exist. You may have mistyped the address, or the page has
            been moved to another URL. If you think this is an error contact support.
          </Text>
          <Button
            variant='outline'
            size='md'
            mt='xl'
            className='max-sm:w-full'
            onClick={() => router.push('/')}>
            Get back to home page
          </Button>
        </div>
        <Image src='/images/404.svg' className='max-md:hidden' />
      </SimpleGrid>
    </Container>
  );
}
