import { BackgroundImage, Box, Center, Container } from '@mantine/core';
import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <BackgroundImage src='/images/authBG.jpg' radius='sm'>
        <Container>{children}</Container>
      </BackgroundImage>
    </Box>
  );
};

export default AuthLayout;
