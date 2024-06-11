import axiosInstance from '@/axiosConfig';
import { UploadImageResponse } from '@/libs/types/UploadImageResponse';

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
