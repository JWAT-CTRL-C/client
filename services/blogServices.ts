import axiosInstance from '@/axiosConfig';
import { UploadImageResponse } from '@/libs/types/UploadImageResponse';
import { blogFormType } from '@/libs/types/blogFormType';
import { filterFalsyFields } from '@/libs/utils';

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
    const filteredBlogData = filterFalsyFields({
      blog_tle: blogData.blog_tle,
      blog_cont: blogData.blog_cont,
      tags: blogData.blog_tag,
      blog_img_url: blogData.blog_img,
      wksp_id: blogData.blog_wksp,
      resrc_id: blogData.blog_src
    });

    console.log(filteredBlogData);

    const response = await axiosInstance.post('/blogs', filteredBlogData);
    return response.data;
  } catch (error: any) {
    console.error('create blog error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const fetchBlogById = async (blog_id: string) => {
  try {
    const response = await axiosInstance.get(`/blogs/${blog_id}`);

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogById error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const fetchBlogsForCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`/blogs/for/user`);

    return response.data;
  } catch (error: any) {
    console.error('fetchBlogsForCurrentUser error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const filterBlogsForCurrentUserByTitle = async (blog_tle: string) => {
  try {
    const response = await axiosInstance.get(`/blogs/filter/title?blog_tle=${blog_tle}`);

    return response.data;
  } catch (error: any) {
    console.error('filterBlogsForCurrentUserByTitle error:', error.response?.data?.message || error.message);
    throw error;
  }
};