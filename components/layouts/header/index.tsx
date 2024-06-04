import React from 'react';
import Logo from './logo';
import AvatarComp from '@/components/avatar';
import { Anchor, Group } from '@mantine/core';

import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  return (
    <header className='py-auto  flex w-full items-center justify-between gap-2'>
      <Logo />
      <Group>
        <Anchor
          onClick={() => router.push('/blog')}
          underline={`${router.pathname === '/blog' ? 'always' : 'hover'}`}>
          Blog
        </Anchor>
        <Anchor
          onClick={() => router.push('/workspace')}
          underline={`${router.pathname === '/workspace' ? 'always' : 'hover'}`}>
          Work space
        </Anchor>
      </Group>
      <div className='mr-4 '>
        <AvatarComp />
      </div>
    </header>
  );
};

export default Header;
