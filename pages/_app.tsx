import '@mantine/core/styles.css';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/libs/theme';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}
