import { showErrorToast, showSuccessToast } from '@/components/shared/toast';
import { useCreateUser, useUpdateUser } from '@/libs/hooks/mutations/userMutations';
import { ErrorResponseType } from '@/libs/types';
import { User, UserForm, UserFormForAdmin } from '@/libs/types/userType';
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
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { FaPlusCircle, FaRegEdit } from 'react-icons/fa';
import { isEmpty } from 'validator';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

type Props = {
  user?: User;
};

const initialValues: Omit<UserFormForAdmin, 'user_id' | 'pass'> = {
  fuln: '',
  email: '',
  phone: '',
  role: 'EM',
  usrn: ''
};

const FormModalAdmin = ({ user }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { createUser, isPending: isLoadingCreate } = useCreateUser();
  const { updateUser, isPending: isLoadingUpdate } = useUpdateUser();
  const form = useForm<Omit<UserFormForAdmin, 'user_id' | 'pass'>>({
    initialValues: initialValues,
    transformValues(values) {
      return {
        ...values,
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || '',
        fuln: values.fuln?.trim() || '',
        usrn: values.usrn?.trim() || ''
      };
    },
    validate: {
      fuln: (val) => {
        if (!val) return 'Full name is required';
        return val && isEmpty(val) ? 'Full name is required' : null;
      },
      usrn: (val) => {
        if (!val) return 'User name is required';
        if (/\s/.test(val)) return 'User name cannot contain spaces';
        return val && isEmpty(val) ? 'User name is required' : null;
      },
      email: (val) => {
        //if (!val) return 'Email is required';
        return val ? (isEmail(val) ? null : 'Invalid email format') : null;
      },
      phone: (val) => {
        // if (!val) return 'Phone number is required';
        return val ? (isMobilePhone(val, 'vi-VN') ? null : 'Invalid phone number format') : null;
      },
      role: (val) => {
        if (val === 'MA') return 'This role cannot select';
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
          usrn: user.usrn || ''
        });
      } else {
        form.setValues(initialValues);
      }
    }
  }, [user, opened]);

  const handleSave = async (data: typeof form.values) => {
    if (!user) {
      createUser(data, {
        onSuccess: () => {
          showSuccessToast('Create user successfully');
          handleClear();
        },
        onError: (error) => {
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
      });
    } else {
      const value: UserForm = {
        email: data.email,
        user_id: user.user_id,
        fuln: data.fuln ?? '',
        phone: data.phone,
        role: data.role
      };

      updateUser(value, {
        onSuccess: () => {
          showSuccessToast('Update user successfully');
          handleClear();
        },
        onError: (error) => {
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
      });
    }
  };

  const handleClear = () => {
    form.reset();
    close();
  };

  return (
    <>
      <Modal
        zIndex={101}
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
                withAsterisk
                name='fuln'
                placeholder='Enter your full name'
                key={form.key('fuln')}
                {...form.getInputProps('fuln')}
                autoComplete='off'
              />

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
          <LoadingOverlay visible={isLoadingCreate || isLoadingUpdate} />
        </form>
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
