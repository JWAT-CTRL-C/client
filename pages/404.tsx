import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';

export default function NotFound() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>NotFound | Synergy</title>
        <meta name='description' content='NotFound' />
      </Head>

      <Container className='flex-center h-dvh'>
        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
          <Image src='/images/404.svg' className='md:hidden' alt='404' />
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
          <Image src='/images/404.svg' className='max-md:hidden' alt='404' />
        </SimpleGrid>
      </Container>
    </>
  );
}
