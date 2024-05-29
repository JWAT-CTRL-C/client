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
import { GoogleButton } from '@/components/shared/GoogleButton';
import { TwitterButton } from '@/components/shared/TwitterButton';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggleType] = useToggle(['login', 'register']);
  const [loading, { toggle }] = useDisclosure();
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

  const handleSubmit =
    type === 'register'
      ? async (values: typeof form.values) => {}
      : async (values: typeof form.values) => {
          try {
            toggle();
            await signIn('credentials', {
              email: values.email,
              password: values.password,
              callbackUrl: searchParams.get('callbackUrl') || '/'
            }).finally(toggle);
          } catch (e) {
            console.log(e);
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
              label='Name'
              placeholder='Your name'
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius='md'
            />
          )}

          <TextInput
            required
            label='Email'
            placeholder='example@synergy.dev'
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
            radius='md'
          />

          <PasswordInput
            required
            label='Password'
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
            radius='md'
          />

          {type === 'register' && (
            <Checkbox
              className='select-none'
              label='I accept terms and conditions'
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
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
          <Button type='submit' radius='xl' loading={loading} disabled={loading}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
