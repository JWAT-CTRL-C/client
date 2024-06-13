import axios from 'axios';
import { getUserAuth, removeUserAuth } from '@/libs/utils';
import { refreshToken } from '@/services/authenServices';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
  // timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add tokens to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const userAuth = getUserAuth();

    if (userAuth) {
      console.info('Request interceptor to add tokens to headers');
      const userId = userAuth.user_id;
      let { access_token } = userAuth;

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      if (userId) {
        config.headers['x-user-id'] = userId.toString();
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Response interceptor to handle unauthorized errors and retry request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 419 && !originalRequest._retry) {
      console.info('Response interceptor to handle token refresh');
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        console.log('handle new token:', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        removeUserAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
