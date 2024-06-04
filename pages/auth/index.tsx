import DefaultLayout from '@/components/layouts/DefaultLayout';
import AuthLayout from '@/components/layouts/authLayout';
import { AuthenticationForm } from '@/components/pages/auth/AuthenticationForm';
import { Container } from '@mantine/core';

export default function Auth() {
  return (
    <div className='flex-center h-dvh w-full'>
      <AuthenticationForm />
    </div>
  );
}

Auth.getLayout = function getLayout(page: any) {
  return <AuthLayout>{page}</AuthLayout>;
};
