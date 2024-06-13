import { useCallback, useEffect } from 'react';
import { FaUserCog } from 'react-icons/fa';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { useUpdateUser, useUploadImage } from '@/libs/hooks/mutations/userMutations';
import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { ErrorResponseType } from '@/libs/types';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Box, Button, Group, Image, LoadingOverlay, Modal, NavLink, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IoCamera } from 'react-icons/io5';
import { showErrorToast, showSuccessToast } from '@/components/shared/toast';

interface IChangeInformationProps {}

function ChangeInformation({}: IChangeInformationProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const { user, isPending } = useMyInfo();

  const { updateUser, isPending: isLoadingUpdate } = useUpdateUser();
  const { uploadImage, isPending: isLoadingUpload } = useUploadImage();

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    uploadImage(acceptedFiles[0], {
      onError: (error) => {
        showErrorToast(error.message);
      },
      onSuccess: () => {
        showSuccessToast('Change avatar successfully');
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: () => {
      showErrorToast('Your image is too big!');
    },
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/webp': ['.webp']
    },
    maxSize: 1024 * 1024 * 10,
    multiple: false,
    onError: (error) => {
      showErrorToast(error.message);
    }
  });

  const form = useForm({
    initialValues: {
      fuln: '',
      email: '',
      phone: ''
    },
    validate: {
      email: (val) => (isEmail(val) ? null : 'Invalid email format'),
      phone: (val) => (isMobilePhone(val, 'vi-VN') ? null : 'Invalid phone number format')
    }
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        fuln: user.fuln,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const isChanged =
    form.values.fuln === user?.fuln && form.values.email === user?.email && form.values.phone === user?.phone;

  const handleSave = async (data: typeof form.values) => {
    updateUser(
      { ...data, user_id: user!.user_id },
      {
        onError: (error) => {
          const errorResponse = error as ErrorResponseType;
          const message = errorResponse.response.data.message as string[];

          message.forEach((msg) => {
            form.setErrors({ [msg.split(' ')[0].toLowerCase()]: msg });
          });
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
      <Modal
        opened={opened}
        onClose={close}
        title='Profile information'
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <form onSubmit={form.onSubmit(handleSave)}>
          <Box mx='auto' style={{ maxWidth: 400 }}>
            <div className='flex-center relative h-full w-full shrink-0 overflow-hidden' {...getRootProps()}>
              <input {...getInputProps()} className='cursor-pointer' />
              <Image
                src={user?.avatar || '/images/default-avatar.png'}
                radius='9999px'
                className='size-28 cursor-pointer object-cover'
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
                {...form.getInputProps('fuln')}
              />
              <FloatingLabelInput
                label='Email'
                name='email'
                placeholder='Enter your email'
                {...form.getInputProps('email')}
              />
              <FloatingLabelInput
                label='Phone Number'
                name='phoneNumber'
                placeholder='Enter your phone number'
                {...form.getInputProps('phone')}
              />
              {/* <PasswordInput label='Change Password' name='password' placeholder='Enter a new password' /> */}
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
      </Modal>

      <NavLink
        label='Profile'
        className={`my-5 cursor-pointer rounded-md p-4`}
        onClick={open}
        leftSection={<FaUserCog size={20} />}></NavLink>
    </>
  );
}

export default ChangeInformation;
