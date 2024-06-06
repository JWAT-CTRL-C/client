import { useToggle, upperFirst, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import isEmail from 'validator/lib/isEmail';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { GoogleButton } from '@/components/shared/GoogleButton';
import { TwitterButton } from '@/components/shared/TwitterButton';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggleType] = useToggle(['login', 'register']);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true
    },
    validate: {
      email: (val) => (isEmail(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
    }
  });

  const searchParams = useSearchParams();

  const handleSubmit = async (values: typeof form.values) => {
    if (type === 'login') {
      try {
        setIsLoading(true);
        await signIn('credentials', {
          email: values.email,
          password: values.password,
          callbackUrl: searchParams.get('callbackUrl') || '/'
        });
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

      <Divider label='Or continue with email' labelPosition='center' my='lg' />

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
            key={form.key('email')}
            required
            label='Email'
            placeholder='example@synergy.dev'
            radius='md'
            {...form.getInputProps('email')}
          />

          <PasswordInput
            key={form.key('password')}
            required
            label='Password'
            placeholder='Your password'
            radius='md'
            {...form.getInputProps('password')}
          />

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
          <Button type='submit' radius='xl' loading={isLoading} disabled={isLoading}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
