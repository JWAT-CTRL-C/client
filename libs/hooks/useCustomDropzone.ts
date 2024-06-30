import { showErrorToast } from '@/components/shared/toast';
import { DropzoneState, ErrorCode, useDropzone } from 'react-dropzone';

export const useCustomDropzone = (onDrop: (files: File[]) => void): DropzoneState => {
  const dropzoneState = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: (files) => {
      const file = files[0];
      if (file.errors.some((error) => error.code === ErrorCode.FileTooLarge)) {
        showErrorToast('Your image is too big!');
      } else if (file.errors.some((error) => error.code === ErrorCode.FileInvalidType)) {
        showErrorToast('Invalid file type!');
      }
    },
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/webp': ['.webp']
    },
    maxSize: 1024 * 1024 * 3,
    multiple: false,
    maxFiles: 1,
    onError: (error) => {
      showErrorToast(error.message);
    }
  });

  return dropzoneState;
};
