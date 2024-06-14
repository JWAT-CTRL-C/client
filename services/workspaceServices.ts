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

export const fetchOneWorkSpace = async (wksp_id: string) => {
  try {
    const response = await axiosInstance.get(`/workspaces/${wksp_id}`);

    return response.data;
  } catch (error: any) {
    console.error('fetchOneWorkSpace error:', error.response?.data?.message || error.message);
    throw error;
  }
};