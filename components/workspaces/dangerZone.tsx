import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

import { useDeleteWorkspace } from '@/libs/hooks/mutations/workspaceMutations';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import { Button, Text } from '@mantine/core';

import PopoverConfirm from '../popoverConfirm';
import { showErrorToast, showSuccessToast } from '../shared/toast';

const DangerZone = ({ wksp_id }: { wksp_id: string }) => {
  const router = useRouter();
  const handleSuccess = (data: GENERAL_RESPONSE_TYPE) => {
    showSuccessToast(data.message);
    router.replace('/workspaces');
  };
  const handleFail = (err: Error | AxiosError) => {
    if (isAxiosError(err)) {
      showErrorToast(err.response?.data.message);
    } else {
      showErrorToast(err.message);
    }
  };
  const { deleteWorkspace, isPending, isSuccess } = useDeleteWorkspace(handleSuccess, handleFail);
  return (
    <div className='max-h-[90vh] px-[8%]'>
      <div className='flex items-center gap-2'>
        <Text className='text-lg font-bold uppercase'>Delete this workspace:</Text>
        <PopoverConfirm
          onConfirm={() => deleteWorkspace(wksp_id)}
          title='Are you sure you want to delete this workspace?'
          disabled={isSuccess}
          size={300}>
          <Button variant='subtle' color='red'>
            <FaTrash />
          </Button>
        </PopoverConfirm>
      </div>
    </div>
  );
};

export default DangerZone;
