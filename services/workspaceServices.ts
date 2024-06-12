import axiosInstance from '@/axiosConfig';

export const fetchWorkspacesForCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`/workspaces/me`);

    return response.data;
  } catch (error: any) {
    console.error('fetchWorkspacesForCurrentUser error:', error.response?.data?.message || error.message);
    throw error;
  }
};
