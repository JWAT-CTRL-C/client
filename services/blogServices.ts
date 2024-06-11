import axiosInstance from '@/axiosConfig';
import { UploadImageResponse } from '@/libs/types/UploadImageResponse';
import { blogFormType } from '@/libs/types/blogFormType';

export const fetchBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blogs');

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogs error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/blogs/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.data.url;
};

export const createBlog = async (blogData: blogFormType): Promise<void> => {
  try {
    const response = await axiosInstance.post('/blogs', {
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      blog_img_url: blogData.blog_img
    });
    return response.data;
  } catch (error: any) {
    console.error('create blog error:', error.response?.data?.message || error.message);
    throw error;
  }
};
