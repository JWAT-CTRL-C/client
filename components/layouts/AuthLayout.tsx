import { BackgroundImage, Box } from '@mantine/core';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box className='flex-center relative h-dvh w-full'>
      <BackgroundImage src='/images/authBG.jpg' bgsz='cover' h='100%'>
        {children}
      </BackgroundImage>
    </Box>
  );
};

export default AuthLayout;
