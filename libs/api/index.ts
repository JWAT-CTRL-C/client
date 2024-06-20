import axios, { AxiosError, AxiosResponse } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'js-cookie';
import Router from 'next/router';

import { RefreshTokenResponse } from '@/libs/types/RefreshTokenResponse';
import { getUserAuth, removeUserAuth, setUserAuth } from '@/libs/utils';

const isServer = () => typeof window === 'undefined';

let context: GetServerSidePropsContext | null = null;

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  // timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add tokens to headers
api.interceptors.request.use((config) => {
  if (isServer() && context) {
    // Server-side: Access cookies from context.req.headers.cookie
    const cookies = context.req.headers.cookie || '';
    const user_id = getCookieValue(cookies, 'user_id');
    const access_token = getCookieValue(cookies, 'access_token');

    if (user_id) config.headers['x-user-id'] = user_id;
    if (access_token) config.headers['Authorization'] = `Bearer ${access_token}`;
  } else if (!isServer()) {
    // Client-side: Access tokens from browser cookies
    const userAuth = getUserAuth();

    if (userAuth) {
      config.headers['Authorization'] = `Bearer ${userAuth.access_token}`;
      config.headers['x-user-id'] = userAuth.user_id;
    }
  }

  return config;
});

// Helper function to extract cookie value
const getCookieValue = (cookies: string, cookieName: string) => {
  const cookie = cookies.split(';').find((c) => c.trim().startsWith(`${cookieName}=`));
  return cookie ? cookie.split('=')[1] : null;
};

// Response interceptor to handle unauthorized errors and retry request
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { response: { config: { __isRetryRequest: boolean } } }) => {
    if (
      error.response &&
      error.response.status === 419 && // Token expired code
      error.response.config &&
      !error.response.config.url?.includes('auth') && // Prevent refreshing token requests
      !error.response.config.__isRetryRequest // Prevent infinite loop
    ) {
      return refreshToken(error);
    }
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null, userId: number | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve({ token, userId });
    }
  });

  failedQueue = [];
};

const refreshToken = async (error: AxiosError & { response: { config: { __isRetryRequest: boolean } } }) => {
  return new Promise((resolve, reject) => {
    const originalRequest = error.response?.config;

    // Queue up the failed request
    failedQueue.push({ resolve, reject });

    if (!isRefreshing) {
      isRefreshing = true;

      let refreshPromise: Promise<AxiosResponse<RefreshTokenResponse, any>> | null = null;
      let _user_id = 0;

      if (isServer() && context) {
        // Server-side refresh
        const cookies = context.req.headers.cookie || '';
        const refresh_token = getCookieValue(cookies, 'refresh_token');
        const user_id = getCookieValue(cookies, 'user_id');

        if (refresh_token && user_id) {
          refreshPromise = api.post<RefreshTokenResponse>('/auth/refresh', {
            refresh_token,
            user_id: +user_id
          });

          _user_id = +user_id;
        }
      } else if (!isServer()) {
        // Client-side refresh
        const userAuth = getUserAuth();

        if (userAuth?.refresh_token) {
          refreshPromise = api.post<RefreshTokenResponse>('/auth/refresh', {
            refresh_token: userAuth.refresh_token,
            user_id: +userAuth.user_id
          });

          _user_id = +userAuth.user_id;
        }
      }

      if (refreshPromise) {
        refreshPromise
          .then((response) => {
            const { access_token, refresh_token } = response.data;

            if (isServer() && context) {
              // Server-side: Set cookies
              context.res.setHeader('Set-Cookie', [
                `user_id=${_user_id}; Max-Age=604800; SameSite=Lax; Path=/`,
                `access_token=${access_token}; Max-Age=604800; SameSite=Lax; Path=/`,
                `refresh_token=${refresh_token}; Max-Age=604800; SameSite=Lax; Path=/`,
                `expired=; Max-Age=0; SameSite=Lax; Path=/`
              ]);
            } else if (!isServer()) {
              // Client-side: Update cookies
              setUserAuth({
                user_id: _user_id.toString(),
                access_token,
                refresh_token
              });
            }

            // Retry the original request and all queued requests
            originalRequest!.headers['Authorization'] = 'Bearer ' + access_token;
            originalRequest!.headers['x-user-id'] = _user_id;
            originalRequest!.__isRetryRequest = true; // Mark as retried to prevent loops
            processQueue(null, access_token, _user_id);
            resolve(api(originalRequest!)); // Retry the original request
          })
          .catch((err) => {
            // Refresh token is invalid, logout the user
            processQueue(err, null, null);
            if (!isServer()) {
              removeUserAuth();
              Cookies.set('expired', 'true', { expires: 7 });
              Router.push('/auth');
            } else if (context && !context.res.headersSent) {
              // Server-side redirect if headers haven't been sent yet
              context.res.setHeader('Set-Cookie', [
                `user_id=; Max-Age=0; SameSite=Lax; Path=/`,
                `access_token=; Max-Age=0; SameSite=Lax; Path=/`,
                `refresh_token=; Max-Age=0; SameSite=Lax; Path=/`,
                `expired=true; Max-Age=604800; SameSite=Lax; Path=/`
              ]);
              context.res.setHeader('location', '/auth');
              context.res.statusCode = 302;
              context.res.end();
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // No refresh token available
        processQueue(new Error('Refresh token not found'), null, null);
        if (!isServer()) {
          removeUserAuth();
          Router.push('/auth');
        } else if (context && !context.res.headersSent) {
          // Server-side redirect if headers haven't been sent yet
          context.res.setHeader('Set-Cookie', [
            `user_id=; Max-Age=0; SameSite=Lax; Path=/`,
            `access_token=; Max-Age=0; SameSite=Lax; Path=/`,
            `refresh_token=; Max-Age=0; SameSite=Lax; Path=/`
          ]);
          context.res.setHeader('location', '/auth');
          context.res.statusCode = 302;
          context.res.end();
        }
      }
    } else {
      // Refreshing is already in progress, just queue the request
    }
  });
};

export default api;
