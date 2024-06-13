import AuthLayout from '@/components/layouts/AuthLayout';
import { AuthenticationForm } from '@/components/pages/auth/AuthenticationForm';
import { NextPageWithLayout } from '../_app';

const Auth: NextPageWithLayout = () => {
  return <AuthenticationForm />;
};

Auth.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Auth;
