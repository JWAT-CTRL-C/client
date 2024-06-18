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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cn } from '@/libs/utils';
import { SocketStoreProvider } from '@/providers/SocketProvider';
import { MantineProvider } from '@mantine/core';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { AppProps } from 'next/app';
import LoadingPageTransition from '@/components/loadingPageTransition';
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function App({
  Component,
  pageProps: { session, dehydratedState, ...pageProps }
}: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 10
          }
        }
      })
  );
  const getLayout = Component.getLayout ?? ((page) => page);

  useIsomorphicLayoutEffect(() => {
    document.body.className = cn('custom-scrollbar-bg min-h-screen font-sans antialiased', inter.variable);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <MantineProvider defaultColorScheme='auto' theme={theme}>
          <SocketStoreProvider>
            <LoadingPageTransition>{getLayout(<Component {...pageProps} />)}</LoadingPageTransition>
            <ToastContainer />
          </SocketStoreProvider>
        </MantineProvider>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
