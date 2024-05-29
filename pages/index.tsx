import { Inter } from 'next/font/google';
import { Button, useMantineColorScheme } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';

import { cn } from '@/libs/utils';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data } = useSession();
  const { toggleColorScheme } = useMantineColorScheme({ keepTransitions: true });

  return (
    <main className={cn('bg-background flex-center h-dvh flex-col p-24', inter.className)}>
      <h1 className='text-4xl font-bold'>Welcome to Synergy</h1>
      <p className='mt-12'>
        You are signed in as <span className='font-bold'>{data?.user?.name}</span> with email:&nbsp;
        <span className='font-bold'>{data?.user?.email}</span>
      </p>
      <p className='mt-12'>This is a protected page</p>
      <Button className='mt-12' onClick={toggleColorScheme}>
        Toggle color scheme
      </Button>
      <Button className='mt-12' onClick={() => signOut()}>
        Sign out
      </Button>
    </main>
  );
}
