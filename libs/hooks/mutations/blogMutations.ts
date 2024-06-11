import { uploadImage } from '@/services/blogServices';
import { useMutation } from '@tanstack/react-query';

export const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      // console.log('Image uploaded successfully:', data);
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
    }
  });

  return {
    uploadImage: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null,
    imageUrl: mutation.data
  };
};
