import axios from 'axios';
import Cookies from 'js-cookie';
import { getUserAuth, setUserAuth, removeUserAuth, isTokenExpired } from '@/libs/utils';
import { refreshToken } from '@/services/authenServices';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add tokens to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const userAuth = getUserAuth();
    console.warn('Request interceptor to add tokens to headers');

    if (userAuth) {
      const userId = userAuth.user_id;
      let { access_token } = userAuth;

      // config.headers.Authorization = `Bearer ${accessToken}`;
      if (isTokenExpired(access_token)) {
        try {
          let newToken = await refreshToken();
          // if (newToken) {
          //   // Token refreshed, update the Authorization header with the new token
          //   config.headers.Authorization = `Bearer ${newToken}`;
          //   config.headers['x-user-id'] = userId.toString();
          //   // Retry the original request
          // }

          access_token = newToken;
        } catch (error) {
          console.error('Unable to refresh token:', error);
          removeUserAuth();
          //window.location.href = '/';
          return Promise.reject(error);
        }
      }

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      if (userId) {
        config.headers['x-user-id'] = userId.toString();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response interceptor to handle unauthorized errors and retry request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.info('Response interceptor to handle token refresh');

    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        console.log('handle new token:', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        removeUserAuth();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
