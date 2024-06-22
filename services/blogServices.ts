import api from '@/libs/api';
import { UploadImageResponse } from '@/libs/types/UploadImageResponse';
import { blogFormType } from '@/libs/types/blogFormType';
import { BlogResponse } from '@/libs/types/blogResponse';
import { filterFalsyFields } from '@/libs/utils';

export const fetchBlogs = async () => {
  try {
    const response = await api.get('/blogs');

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogs error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const fetchRecentBlogs = async () => {
  try {
    const response = await api.get('/blogs/recent');

    return response.data;
  } catch (error: any) {
    console.error('fetchRecentBlogs error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<UploadImageResponse>('/blogs/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data?.data?.url;
  } catch (error: any) {
    console.error('uploadImage error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createBlog = async (blogData: blogFormType): Promise<void> => {
  try {
    const filteredBlogData = filterFalsyFields({
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      blog_img_url: blogData.blog_img,
      wksp_id: blogData.blog_wksp,
      resrc_id: blogData.blog_src
    });

    const response = await api.post('/blogs', filteredBlogData);
    return response.data;
  } catch (error: any) {
    console.error('create blog error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const fetchBlogById = async (blog_id: string) => {
  try {
    const response = await api.get(`/blogs/${blog_id}`);

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogById error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const fetchBlogsForCurrentUser = async () => {
  try {
    const response = await api.get(`/blogs/for/user`);

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogsForCurrentUser error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const filterBlogsForCurrentUserByTitle = async (blog_tle: string) => {
  try {
    const response = await api.get(`/blogs/filter/title?blog_tle=${blog_tle}`);

    return response.data;
  } catch (error: any) {
    console.error('filterBlogsForCurrentUserByTitle error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const removeBlogById = async (blog_id: string) => {
  try {
    const response = await api.delete(`/blogs/${blog_id}`);

    return response.data;
  } catch (error: any) {
    console.error('removeBlogById error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateBlog = async (blog_id: string, blogData: blogFormType): Promise<void> => {
  try {
    const filteredBlogData = filterFalsyFields({
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      resrc_id: blogData.blog_src
    });

    const response = await api.patch(`/blogs/${blog_id}`, filteredBlogData);
    return response.data;
  } catch (error: any) {
    console.error('update blog error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createBlogCommentById = async (blog_id: string, blog_cmt_cont: string) => {
  try {
    const response = await api.post(`/blogs/${blog_id}/comments`, {
      blog_cmt_cont
    });

    return response.data;
  } catch (error: any) {
    console.error('createBlogCommentById error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const ratingBlogById = async (blog_id: string) => {
  try {
    await api.put(`/blogs/${blog_id}/rating`);
  } catch (error: any) {
    console.error('ratingBlogById error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const fetchRelatedBlogs = async (blog_id: string) => {
  try {
    const response = await api.get(`blogs/3-126ac9f6149081eb0e97c2e939eaad52-1718623290608/related`);

    return response.data;
  } catch (error: any) {
    console.error('fetchRelatedBlogs error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
