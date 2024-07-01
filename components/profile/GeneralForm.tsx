import { useEffect } from 'react';
import { FileWithPath } from 'react-dropzone';
import { IoCamera } from 'react-icons/io5';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { useUpdateUser, useUploadImage } from '@/libs/hooks/mutations/userMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { useCustomDropzone } from '@/libs/hooks/useCustomDropzone';
import { ErrorResponseType } from '@/libs/types';
import { UserForm } from '@/libs/types/userType';
import { Box, Button, CloseButton, Group, Image, LoadingOverlay, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { FloatingLabelInput } from '../shared/FloatingLabelInput';
import { showErrorToast, showSuccessToast } from '../shared/toast';

interface GeneralFormProps {
  close: () => void;
  opened: boolean;
}

export default function GeneralForm({ close, opened }: GeneralFormProps) {
  const { user, isPending } = useMyInfo();

  const { updateUser, isPending: isLoadingUpdate } = useUpdateUser();
  const { uploadImage, isPending: isLoadingUpload } = useUploadImage();

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    uploadImage(acceptedFiles[0], {
      onError: (error) => {
        showErrorToast(error.message);
      },
      onSuccess: () => {
        showSuccessToast('Change avatar successfully');
      }
    });
  };

  const { getRootProps, getInputProps } = useCustomDropzone(onDrop);

  const form = useForm<Omit<UserForm, 'user_id'>>({
    initialValues: {
      fuln: '',
      email: '',
      phone: ''
    },
    transformValues(values) {
      return {
        ...values,
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || ''
      };
    },
    validate: {
      email: (val) => (!val ? null : isEmail(val) ? null : 'Invalid email format'),
      phone: (val) => (!val ? null : isMobilePhone(val, 'vi-VN') ? null : 'Invalid phone number format')
    }
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        fuln: user.fuln,
        email: user.email ?? '',
        phone: user.phone ?? ''
      });
    }
  }, [user, opened]);

  const isChanged =
    form.values.fuln === user?.fuln && form.values.email === user?.email && form.values.phone === user?.phone;

  const handleSave = async (data: typeof form.values) => {
    updateUser(
      { ...data, user_id: user.user_id },
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
          showSuccessToast('Profile updated successfully');
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Box mx='auto' my={10} style={{ maxWidth: 400 }}>
          <div className='flex-center relative h-full w-full shrink-0 overflow-hidden' {...getRootProps()}>
            <input {...getInputProps()} className='cursor-pointer' value='' />
            <Image
              src={user?.avatar || '/images/default-avatar.png'}
              radius='9999px'
              className='size-28 cursor-pointer object-cover'
              alt='avatar'
              mb='md'
            />

            <button
              type='button'
              className='absolute -bottom-0 left-1/2 hidden -translate-x-1/2 rounded-full p-1.5 shadow sm:flex'>
              <IoCamera className='md hydrated text-2xl dark:text-violet-300' aria-label='camera' />
            </button>
          </div>
          <Stack gap='sm'>
            <FloatingLabelInput
              label='Full Name'
              name='fullName'
              placeholder='Enter your full name'
              required
              rightSection={
                <CloseButton
                  aria-label='Clear input'
                  onClick={() => form.setValues({ fuln: '' })}
                  style={{ display: form.values.fuln ? undefined : 'none' }}
                />
              }
              {...form.getInputProps('fuln')}
            />
            <FloatingLabelInput
              label='Email'
              name='email'
              placeholder='Enter your email'
              rightSection={
                <CloseButton
                  aria-label='Clear input'
                  onClick={() => form.setValues({ email: '' })}
                  style={{ display: form.values.email ? undefined : 'none' }}
                />
              }
              {...form.getInputProps('email')}
            />
            <FloatingLabelInput
              label='Phone Number'
              name='phoneNumber'
              placeholder='Enter your phone number'
              rightSection={
                <CloseButton
                  aria-label='Clear input'
                  onClick={() => form.setValues({ phone: '' })}
                  style={{ display: form.values.phone ? undefined : 'none' }}
                />
              }
              {...form.getInputProps('phone')}
            />
          </Stack>
          <Group justify='end' mt='md'>
            <Button variant='outline' onClick={close}>
              Cancel
            </Button>
            <Button type='submit' loading={isLoadingUpdate} disabled={isChanged}>
              Save
            </Button>
          </Group>
        </Box>
      </form>
      <LoadingOverlay visible={isPending || isLoadingUpload} />
    </>
  );
}
