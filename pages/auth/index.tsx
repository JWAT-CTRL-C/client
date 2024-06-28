import { AuthenticationForm } from '@/components/pages/auth/AuthenticationForm';
import { NextPageWithLayout } from '../_app';
import AuthLayout from '@/components/layouts/AuthLayout';
import TokenExpired from '@/components/pages/auth/TokenExpired';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie || '';
  const expired = cookies.includes('expired');

  return {
    props: { expired }
  };
};

const Auth: NextPageWithLayout<{ expired: boolean }> = ({ expired }) => {
  return (
    <>
      <Head>
        <title>Login | Synergy</title>
        <meta name='description' content='Login' />
      </Head>
      <div className='flex h-dvh justify-between'>
        <AuthenticationForm />
        <TokenExpired expired={expired} />
      </div>
    </>
  );
};

Auth.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Auth;
