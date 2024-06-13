import { GoogleButton } from '@/components/shared/GoogleButton';
import { TwitterButton } from '@/components/shared/TwitterButton';
import { useLogin } from '@/libs/hooks/mutations/useLogin';
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggleType] = useToggle(['login', 'register']);
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginFunc, isPending, isError, errorMessage } = useLogin();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      password: '',
      terms: true
    },
    validate: {
      username: (val) => (val.trim().length === 0 ? 'Invalid email' : null),
      // password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
      password: (val) => (val.trim().length === 0 ? 'Password is required' : null)
    }
  });

  const searchParams = useSearchParams();

  const handleSubmit = async (values: typeof form.values) => {
    if (type === 'login') {
      try {
        setIsLoading(true);

        loginFunc({ usrn: values.username, pass: values.password });

        // await signIn('credentials', {
        //   email: values.email,
        //   password: values.password,
        //   callbackUrl: searchParams.get('callbackUrl') || '/'
        // });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register user
    }
  };

  return (
    <Paper radius='md' p='xl' withBorder {...props}>
      <Text size='lg' fw={500}>
        Welcome to Synergy, {type} with
      </Text>

      <Group grow mb='md' mt='md'>
        <GoogleButton radius='xl'>Google</GoogleButton>
        <TwitterButton radius='xl'>Twitter</TwitterButton>
      </Group>

      <Divider label='Or continue with username' labelPosition='center' my='lg' />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              key={form.key('name')}
              label='Name'
              placeholder='Your name'
              radius='md'
              {...form.getInputProps('name')}
            />
          )}

          <TextInput
            key={form.key('username')}
            required
            label='username'
            placeholder='example_synergy_dev'
            radius='md'
            {...form.getInputProps('username')}
          />

          <PasswordInput
            key={form.key('password')}
            required
            label='Password'
            placeholder='Your password'
            radius='md'
            {...form.getInputProps('password')}
          />

          {errorMessage && (
            <Text c={'red'} fz={'sm'}>
              {errorMessage}
            </Text>
          )}

          {type === 'register' && (
            <Checkbox
              key={form.key('terms')}
              className='select-none'
              label='I accept terms and conditions'
              {...form.getInputProps('terms', { type: 'checkbox' })}
            />
          )}
        </Stack>

        <Group justify='space-between' mt='xl'>
          <Anchor
            component='button'
            type='button'
            c='dimmed'
            onClick={() => {
              toggleType();
              form.reset();
            }}
            size='xs'>
            {type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Anchor>
          <Button type='submit' radius='xl' loading={isPending} disabled={isPending}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
