import { BackgroundImage, Box, Center } from '@mantine/core';
import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <BackgroundImage src='/images/authBG.jpg' radius='sm'>
        {children}
      </BackgroundImage>
    </Box>
  );
};

export default AuthLayout;
