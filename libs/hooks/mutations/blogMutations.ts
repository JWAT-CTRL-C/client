import { blogFormType } from '@/libs/types/blogFormType';
import { RemoveBlogResponse } from '@/libs/types/removeBlogResponse';
import { createBlog, removeBlogById, updateBlog, uploadImage } from '@/services/blogServices';
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
      await queryClient.invalidateQueries({ queryKey: ['blogs', 'blogs-current-user'] });
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

export const useRemoveBlogById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RemoveBlogResponse, Error, string>({
    mutationFn: async (blog_id: string) => await removeBlogById(blog_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blogs-current-user'] });
    },
    onError: (error) => {
      console.error('Error removing blog:', error);
    }
  });

  return {
    removeBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};

export const useUpdateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, { blog_id: string; blogData: blogFormType }>({
    mutationFn: async ({ blog_id, blogData }) => await updateBlog(blog_id, blogData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blogs', 'blogs-current-user'] });
      router.push('/blogs');
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    }
  });

  return {
    updateBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};
