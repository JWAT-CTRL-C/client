import { useChangePassword } from '@/libs/hooks/mutations/userMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { ErrorResponseType } from '@/libs/types';
import { Box, Button, CloseButton, Group, LoadingOverlay, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { FloatingLabelInput } from '../shared/FloatingLabelInput';
import { showErrorToast, showSuccessToast } from '../shared/toast';

interface PasswordFormProps {
  close: () => void;
}

export default function PasswordForm({ close }: PasswordFormProps) {
  const { user, isPending } = useMyInfo();

  const { changePassword, isPending: isPendingChangePassword } = useChangePassword();

  const form = useForm({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    },
    validate: {
      old_password: (val) => (!val ? 'Old password is required' : null),
      new_password: (val) => (!val ? 'New password is required' : null),
      confirm_password: (val, values) =>
        !val ? 'Confirm password is required' : val === values.new_password ? null : 'Password does not match'
    }
  });

  const isChanged =
    !form.errors.old_password &&
    !form.errors.new_password &&
    !form.errors.confirm_password &&
    !!form.values.old_password &&
    !!form.values.new_password &&
    !!form.values.confirm_password;

  const handleSave = async (data: typeof form.values) => {
    changePassword(
      { user_id: user.user_id, oldPass: data.old_password, newPass: data.new_password },
      {
        onError: (error) => {
          const errorResponse = error as ErrorResponseType;
          const message = errorResponse.response.data.message;

          if (typeof message === 'string') {
            showErrorToast(message);
          } else {
            message.forEach((msg) => {
              form.setErrors({ [msg.split(' ')[0].toLowerCase()]: msg });
            });
          }
        },
        onSuccess: () => {
          close();
          showSuccessToast('Password updated successfully');
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Box mx='auto' my={10} style={{ maxWidth: 400 }}>
          <Stack gap='sm'>
            <FloatingLabelInput
              label='Your old password'
              type='password'
              name='old_password'
              placeholder='Enter your old password'
              required
              {...form.getInputProps('old_password')}
            />
            <FloatingLabelInput
              label='New Password'
              type='password'
              name='new_password'
              required
              placeholder='Enter your new password'
              {...form.getInputProps('new_password')}
            />
            <FloatingLabelInput
              label='Confirm Password'
              type='password'
              name='confirm_password'
              required
              placeholder='Enter your new password again'
              {...form.getInputProps('confirm_password')}
            />
          </Stack>
          <Group justify='end' mt='md'>
            <Button variant='outline' onClick={close}>
              Cancel
            </Button>
            <Button type='submit' loading={isPendingChangePassword} disabled={!isChanged}>
              Save
            </Button>
          </Group>
        </Box>
      </form>
      <LoadingOverlay visible={isPending || isPendingChangePassword} />
    </>
  );
}
