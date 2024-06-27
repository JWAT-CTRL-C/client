import React, { useEffect } from 'react';
import { FaPlusCircle, FaRegEdit } from 'react-icons/fa';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useCreateUser, useUpdateUser } from '@/libs/hooks/mutations/userMutations';
import { ErrorResponseType } from '@/libs/types';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { User, UserForm, UserFormForAdmin } from '@/libs/types/userType';
import { isEmpty } from 'validator';
import { AxiosError } from 'axios';

type Props = {
  user?: User;
};

const initialValues: Omit<UserFormForAdmin, 'user_id'> = {
  fuln: '',
  email: '',
  phone: '',
  role: 'EM',
  pass: '',
  usrn: ''
};

const FormModalAdmin = ({ user }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { createUser, isPending: isLoadingCreate } = useCreateUser();
  const { updateUser, isPending: isLoadingUpdate } = useUpdateUser();
  const form = useForm<Omit<UserFormForAdmin, 'user_id'>>({
    initialValues: initialValues,
    transformValues(values) {
      return {
        ...values,
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || '',
        fuln: values.fuln?.trim() || '',
        pass: values.pass?.trim() || '',
        usrn: values.usrn?.trim() || ''
      };
    },
    validate: {
      pass: (val) => {
        if (!user) {
          if (!val) return 'Password is required';
          return val && isEmpty(val) ? 'Password is required' : null;
        }
      },
      usrn: (val) => {
        if (!val) return 'User name is required';
        if (/\s/.test(val)) return 'User name cannot contain spaces';
        return val && isEmpty(val) ? 'User name is required' : null;
      },
      email: (val) => {
        if (!val) return 'Email is required';
        return isEmail(val) ? null : 'Invalid email format';
      },
      phone: (val) => {
        if (!val) return 'Phone number is required';
        return isMobilePhone(val, 'vi-VN') ? null : 'Invalid phone number format';
      }
    }
  });

  useEffect(() => {
    if (opened) {
      if (user) {
        form.setValues({
          fuln: user.fuln || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'EM',
          pass: '',
          usrn: user.usrn || ''
        });
      } else {
        form.setValues(initialValues);
      }
    }
  }, [user, opened]);

  const handleSave = async (data: typeof form.values) => {
    try {
      if (!user) {
        await createUser(data);
        showSuccessToast('Create user successfully');
      } else {
        const value: UserForm = {
          email: data.email,
          user_id: user.user_id,
          fuln: data.fuln ?? '',
          phone: data.phone,
          role: data.role
        };
        await updateUser(value);
        showSuccessToast('Update user successfully');
      }
      handleClear();
    } catch (error) {
      const errorResponse = error as AxiosError<ErrorResponseType>;
      const message = errorResponse.response?.data?.message;
      if (typeof message === 'string') {
        showErrorToast(message);
      } else if (Array.isArray(message)) {
        (message as string[]).forEach((msg: string) => {
          const field = msg.split(' ')[0].toLowerCase();
          form.setErrors({ [field]: msg });
        });
        showErrorToast('Please check the form for errors.');
      } else {
        showErrorToast('An unexpected error occurred.');
      }
    }
  };

  const handleClear = () => {
    form.reset();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`${user ? 'Edit' : 'Create'} account`}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <form onSubmit={form.onSubmit(handleSave)} autoComplete='off'>
          <Box mx='auto' style={{ maxWidth: 400 }}>
            <Stack gap='sm'>
              <TextInput
                withAsterisk
                label='User Name'
                disabled={!!user}
                name='usrn'
                placeholder='Enter your user name'
                key={form.key('usrn')}
                {...form.getInputProps('usrn')}
                autoComplete='off'
              />
              <TextInput
                label='Full Name'
                name='fuln'
                placeholder='Enter your full name'
                key={form.key('fuln')}
                {...form.getInputProps('fuln')}
                autoComplete='off'
              />
              {!user && (
                <PasswordInput
                  label='Password'
                  withAsterisk
                  disabled={!!user}
                  name='pass'
                  placeholder='Enter your password'
                  key={form.key('pass')}
                  {...form.getInputProps('pass')}
                  autoComplete='new-password'
                />
              )}

              <TextInput
                label='Email'
                name='email'
                placeholder='Enter your email'
                key={form.key('email')}
                {...form.getInputProps('email')}
                autoComplete='off'
              />
              <TextInput
                label='Phone'
                name='phone'
                placeholder='Enter your phone number'
                key={form.key('phone')}
                {...form.getInputProps('phone')}
                autoComplete='off'
              />

              <Select
                label='Role'
                allowDeselect={false}
                name='role'
                placeholder='Choose your role'
                key={form.key('role')}
                {...form.getInputProps('role')}
                data={[
                  {
                    value: 'HM',
                    label: 'Head Master'
                  },
                  {
                    value: 'PM',
                    label: 'Project manager'
                  },
                  {
                    value: 'EM',
                    label: 'Employee'
                  },
                  {
                    value: 'MA',
                    label: 'Master Admin',
                    disabled: true
                  }
                ]}
              />
            </Stack>
            <Group justify='end' mt='md'>
              <Button variant='outline' onClick={handleClear}>
                Cancel
              </Button>
              <Button type='submit'>Save</Button>
            </Group>
          </Box>
        </form>

        <LoadingOverlay visible={isLoadingCreate || isLoadingUpdate} />
      </Modal>

      {!user && (
        <Button className='' onClick={open}>
          <FaPlusCircle />
          <span className='ml-2 hidden md:inline'>New User</span>
        </Button>
      )}

      {user && (
        <ActionIcon onClick={open}>
          <FaRegEdit />
        </ActionIcon>
      )}
    </>
  );
};

export default FormModalAdmin;
