import { useRouter } from 'next/router';

import { useLogin } from '@/libs/hooks/mutations/useLogin';
import { ErrorResponseType } from '@/libs/types';
import { Button, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

export function AuthenticationForm() {
  const { login: loginFunc, isPending } = useLogin();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    },
    validate: {
      username: (val) => (val.trim().length === 0 ? 'Invalid email' : null),
      password: (val) => (val.trim().length === 0 ? 'Password is required' : null)
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    loginFunc(
      { usrn: values.username, pass: values.password },
      {
        onSuccess() {
          router.push('/dashboard');
        },
        onError(error) {
          switch ((error as ErrorResponseType).response.status) {
            case 401:
              form.setErrors({ password: 'Password is incorrect' });
              break;
            case 404:
              form.setErrors({ username: 'Username is not found' });
          }
        }
      }
    );
  };

  return (
    <Paper className='h-full w-full pt-[80px] md:w-[450px]' radius={0} p={30} pt={60}>
      <Title order={2} className='' ta='center' mt='md' mb={50}>
        Welcome back to Synergy!
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label='Username' placeholder='Synergy' size='md' {...form.getInputProps('username')} />
        <PasswordInput
          label='Password'
          placeholder='*********'
          mt='md'
          size='md'
          {...form.getInputProps('password')}
        />

        <Button type='submit' fullWidth mt='xl' size='md' loading={isPending}>
          Login
        </Button>
      </form>
    </Paper>
  );
}
