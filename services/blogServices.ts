import api from '@/libs/api';
import { UploadImageResponse } from '@/libs/types/UploadImageResponse';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';
import { BlogResponse } from '@/libs/types/blogResponse';
import { workspacesType } from '@/libs/types/workspacesType';

export const fetchBlogs = async (): Promise<BlogResponse[]> => {
  return new Promise((resolve, reject) => {
    api
      .get('/blogs')
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const fetchRecentBlogs = async (): Promise<BlogResponse[]> => {
  return new Promise((resolve, reject) => {
    api
      .get('/blogs/recent')
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    api
      .post<UploadImageResponse>('/blogs/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => resolve(response.data?.data?.url))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const createBlog = async (blogData: blogFormType): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filteredBlogData = filterFalsyFields({
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      blog_img_url: blogData.blog_img,
      wksp_id: blogData.blog_wksp,
      resrc_id: blogData.blog_src
    });

    api
      .post('/blogs', filteredBlogData)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const fetchBlogById = async (blog_id: string): Promise<BlogResponse> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/blogs/${blog_id}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const fetchBlogsForCurrentUser = async (): Promise<BlogResponse[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/blogs/for/user`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const filterBlogsForCurrentUserByTitle = async (blog_tle: string): Promise<BlogResponse[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/blogs/filter/title?blog_tle=${blog_tle}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const removeBlogById = async (blog_id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/blogs/${blog_id}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const updateBlog = async (blog_id: string, blogData: blogFormType): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filteredBlogData = filterFalsyFields({
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      resrc_id: blogData.blog_src
    });

    api
      .patch(`/blogs/${blog_id}`, filteredBlogData)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const createBlogCommentById = async (blog_id: string, blog_cmt_cont: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .post(`/blogs/${blog_id}/comments`, { blog_cmt_cont })
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const ratingBlogById = async (blog_id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/blogs/${blog_id}/rating`)
      .then(() => resolve())
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const fetchRelatedBlogs = async (blog_id: string): Promise<BlogResponse[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`blogs/${blog_id}/related`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};

export const fetchWorkspacesInfo = async (): Promise<
  Pick<workspacesType, 'wksp_id' | 'wksp_name' | 'resources'>[]
> => {
  return new Promise((resolve, reject) => {
    api
      .get(`blogs/workspace-info`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(new Error(error.response?.data?.message || error.message));
      });
  });
};
