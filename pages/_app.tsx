import '@mantine/core/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@mantine/tiptap/styles.css';
import '@/styles/globals.css';

import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import { ReactElement, ReactNode, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useIsomorphicLayoutEffect } from 'react-use';

import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import { SocketStoreProvider } from '@/providers/SocketProvider';
import { MantineProvider } from '@mantine/core';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { AppProps } from 'next/app';
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: true, refetchOnWindowFocus: false } } })
  );
  const getLayout = Component.getLayout ?? ((page) => page);

  useIsomorphicLayoutEffect(() => {
    document.body.className = cn('custom-scrollbar-bg min-h-screen font-sans antialiased', inter.variable);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <MantineProvider defaultColorScheme='auto' theme={theme}>
          <SocketStoreProvider>
            {getLayout(<Component {...pageProps} />)}
            <ToastContainer />
          </SocketStoreProvider>
        </MantineProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
