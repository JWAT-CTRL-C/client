import '@mantine/core/styles.css';
import '@/styles/globals.css';
import '@mantine/tiptap/styles.css';

import { ReactElement, ReactNode, useState } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
// import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { useIsomorphicLayoutEffect } from 'react-use';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  useIsomorphicLayoutEffect(() => {
    document.body.className = cn('custom-scrollbar-bg min-h-screen font-sans antialiased', inter.variable);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        {/* <SessionProvider session={session}> */}
          <MantineProvider defaultColorScheme='auto' theme={theme}>
            {getLayout(<Component {...pageProps} />)}
          </MantineProvider>
        {/* </SessionProvider> */}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
