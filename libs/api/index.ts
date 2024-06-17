import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

import { RefreshTokenResponse } from '@/libs/types/RefreshTokenResponse';
import { getUserAuth, removeUserAuth, setUserAuth } from '@/libs/utils';

const isServer = () => {
  return typeof window === 'undefined';
};

let context = <GetServerSidePropsContext>{};

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  // timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add tokens to headers
api.interceptors.request.use((config) => {
  if (isServer() && context?.req?.cookies) {
    config.headers.Cookie = `gid=${context.req.cookies.gid};`;
  }

  if (!isServer()) {
    const userAuth = getUserAuth();

    if (userAuth) {
      const userId = userAuth.user_id;
      let { access_token } = userAuth;

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      if (userId) {
        config.headers['x-user-id'] = userId.toString();
      }
    }
  } else {
    if (context.req.headers.cookie) {
      const cookies = context.req.headers.cookie;
      const user_id_cookie = cookies
        .split(';')
        .find((cookie: string) => cookie.trim().startsWith('user_id='));
      if (user_id_cookie) {
        const user_id = user_id_cookie.split('=')[1];
        config.headers['x-user-id'] = user_id;
      }
      const access_token_cookie = cookies
        .split(';')
        .find((cookie: string) => cookie.trim().startsWith('access_token='));
      if (access_token_cookie) {
        const access_token = access_token_cookie.split('=')[1];
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    }
  }
  return config;
});

//Response interceptor to handle unauthorized errors and retry request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 419 &&
      !error.response.config?.url?.includes('auth/refresh') &&
      !error.response.config?.url?.includes('auth')
    ) {
      return refreshToken(error);
    }
    return Promise.reject(error);
  }
);

let fetchingToken = false;
let subscribers: ((token: string) => any)[] = [];

const onAccessTokenFetched = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => any) => {
  subscribers.push(callback);
};

const refreshToken = async (oError: AxiosError) => {
  try {
    const { response } = oError;

    // create new Promise to retry original request
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((token: string) => {
        response!.config.headers['Authorization'] = `Bearer ${token}`;
        resolve(axios(response!.config));
      });
    });

    // check whether refreshing token or not
    if (!fetchingToken) {
      fetchingToken = true;

      let data: RefreshTokenResponse = { access_token: '', refresh_token: '' };

      // check if this is server or not
      if (!isServer()) {
        const userAuth = getUserAuth();
        const response = await axios.post<RefreshTokenResponse>(`${baseURL}/auth/refresh`, {
          refresh_token: userAuth.refresh_token,
          user_id: userAuth.user_id
        });
        data = response.data;

        setUserAuth({
          user_id: userAuth.user_id!,
          ...data
        });
      } else {
        if (context.req.headers.cookie) {
          const cookies = context.req.headers.cookie;
          const user_id_cookie = cookies
            .split(';')
            .find((cookie: string) => cookie.trim().startsWith('user_id='));
          const refresh_token_cookie = cookies
            .split(';')
            .find((cookie: string) => cookie.trim().startsWith('refresh_token='));
          if (user_id_cookie && refresh_token_cookie) {
            const user_id = user_id_cookie.split('=')[1];
            const refresh_token = refresh_token_cookie.split('=')[1];
            const response = await axios.post<RefreshTokenResponse>(`${baseURL}/auth/refresh`, {
              refresh_token: refresh_token,
              user_id: user_id
            });
            data = response.data;
            context.res.setHeader('Set-Cookie', [
              `user_id=${user_id}; HttpOnly; Max-Age=604800; SameSite=Lax; Path=/`,
              `access_token=${data.access_token}; HttpOnly; Max-Age=604800; SameSite=Lax; Path=/`,
              `refresh_token=${data.refresh_token}; HttpOnly; Max-Age=604800; SameSite=Lax; Path=/`
            ]);
          }
        }
      }

      // when new token arrives, retry old requests
      onAccessTokenFetched(data.access_token);
    }
    return retryOriginalRequest;
  } catch (error) {
    // on error go to login page
    if (!isServer() && !Router.asPath.includes('/auth')) {
      removeUserAuth();
      Router.push('/auth');
    }
    if (isServer()) {
      context.res.setHeader('location', '/auth');
      context.res.statusCode = 302;
      context.res.end();
    }
    return Promise.reject(oError);
  } finally {
    fetchingToken = false;
  }
};

export default api;
