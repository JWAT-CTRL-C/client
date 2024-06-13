import { BackgroundImage, Box, Center, Container } from '@mantine/core';
import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box className='flex-center h-dvh w-full'>
      <BackgroundImage src='/images/authBG.jpg' bgsz='cover' h='100%'>
        {children}
      </BackgroundImage>
    </Box>
  );
};

export default AuthLayout;
