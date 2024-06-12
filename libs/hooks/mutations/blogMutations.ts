import { blogFormType } from '@/libs/types/blogFormType';
import { createBlog, uploadImage } from '@/services/blogServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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

export const useCreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, blogFormType>({
    mutationFn: createBlog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/blogs');
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
    }
  });

  return {
    createBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};
