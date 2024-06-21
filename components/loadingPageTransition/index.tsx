import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

const LoadingPageTransition = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.pathname]);

  return (
    <div className='relative'>
      {children}
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
    </div>
  );
};

export default LoadingPageTransition;
