import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
import { GET_ALL_WORKSPACES_BY_USER_KEY } from '@/libs/constants/queryKeys/workspace';
import { blogFormType } from '@/libs/types/blogFormType';
import { RemoveBlogResponse } from '@/libs/types/removeBlogResponse';
import {
  createBlog,
  createBlogCommentById,
  ratingBlogById,
  removeBlogById,
  updateBlog,
  uploadImage
} from '@/services/blogServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

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
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, blogFormType>({
    mutationFn: createBlog,
    onSuccess: async () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER]
        })
      ]);
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
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER]
        })
      ]);
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
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, { blog_id: string; blogData: blogFormType }>({
    mutationFn: async ({ blog_id, blogData }) => await updateBlog(blog_id, blogData),
    onSuccess: async () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER]
        })
      ]);
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    }
  });

  return {
    updateBlog: mutation.mutateAsync,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};

export const useCreateBlogComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, { blog_id: string; blog_cmt_cont: string }>({
    mutationFn: async ({ blog_id, blog_cmt_cont }) => await createBlogCommentById(blog_id, blog_cmt_cont),
    onSuccess: async (data, variables) => {
      const { blog_id } = variables;
      await queryClient.invalidateQueries({
        queryKey: [BlogQueryEnum.BLOGS, blog_id]
      });
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    }
  });

  return {
    createBlogComment: mutation.mutateAsync,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};

export const useRatingBlog = () => {
  const queryClient = useQueryClient();
  //const router = useRouter();

  const mutation = useMutation<void, Error, { blog_id: string }>({
    mutationFn: async ({ blog_id }) => await ratingBlogById(blog_id),
    onSuccess: async (data, variables) => {
      const { blog_id } = variables;

      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS, blog_id]
        }),
        // queryClient.invalidateQueries({
        //   queryKey: [BlogQueryEnum.BLOGS_RELATED, blog_id]
        // }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_RELATED]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_RECENT]
        })
      ]);

      // if (router.pathname === '/workspaces/[id]') {
      //   await queryClient.invalidateQueries({
      //     queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY + router.query.id]
      //   });
      // }
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    }
  });

  return {
    ratingBlog: mutation.mutateAsync,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};
