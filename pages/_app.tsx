import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@/styles/globals.css';

import { NextPage } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useIsomorphicLayoutEffect } from 'react-use';

import { theme } from '@/libs/theme';
import { cn } from '@/libs/utils';
import { AbilityProvider } from '@/providers/AbilityProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { MantineProvider } from '@mantine/core';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { AppProps } from 'next/app';

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
    <>
      <Head>
        <title>Synergy</title>
        <meta name='description' content='Synergy' />
      </Head>

      <MantineProvider defaultColorScheme='auto' theme={theme}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <StoreProvider>
              <AbilityProvider>
                <NextNProgress color='#7c3aed' />
                {getLayout(<Component {...pageProps} />)}
                <ToastContainer />
              </AbilityProvider>
            </StoreProvider>
          </HydrationBoundary>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
