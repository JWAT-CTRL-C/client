import { BackgroundImage, Box } from '@mantine/core';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box className='flex-center relative h-dvh w-full'>
      <BackgroundImage src='/images/authBG.jpg' bgsz='cover' className='w-full'>
        {children}
      </BackgroundImage>
    </Box>
  );
};

export default AuthLayout;
