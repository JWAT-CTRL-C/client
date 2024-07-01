import { BlogQueryEnum } from '@/libs/constants/queryKeys/blog';
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

export const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (_data) => {},
    onError: (_error) => {}
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
    onError: (_error) => {}
  });

  return {
    createBlog: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};

export const useRemoveBlogById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: (blog_id: string) => removeBlogById(blog_id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_CURRENT_USER]
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_MASTER_ADMIN]
        })
      ]);
    },
    onError: (_error) => {}
  });

  return {
    removeBlog: mutation.mutate,
    isPending: mutation.isPending, // Correct property name for loading state
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
    onError: (_error) => {}
  });

  return {
    updateBlog: mutation.mutate,
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
    onSuccess: async (_data, variables) => {
      const { blog_id } = variables;
      await queryClient.invalidateQueries({
        queryKey: [BlogQueryEnum.BLOGS, blog_id]
      });
    },
    onError: (_error) => {}
  });

  return {
    createBlogComment: mutation.mutate,
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
    onSuccess: async (_data, variables) => {
      const { blog_id } = variables;

      await Promise.all([
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
        }),
        queryClient.invalidateQueries({
          queryKey: [BlogQueryEnum.BLOGS_WORKSPACE]
        })
      ]);

      // if (router.pathname === '/workspaces/[id]') {
      //   await queryClient.invalidateQueries({
      //     queryKey: [GET_ALL_WORKSPACES_BY_USER_KEY + router.query.id]
      //   });
      // }
    },
    onError: (_error) => {}
  });

  return {
    ratingBlog: mutation.mutate,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message || null
  };
};
