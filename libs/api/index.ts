import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

import { RefreshTokenResponse } from '@/libs/types/RefreshTokenResponse';
import { getUserAuth, removeUserAuth, setUserAuth } from '@/libs/utils';

const isServer = () => typeof window === 'undefined';

let context = <GetServerSidePropsContext>{};

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add tokens to headers
api.interceptors.request.use((config) => {
  if (isServer()) {
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
        config.headers['Authorization'] = `Bearer ${access_token}`;
      }
    }

    if (context?.req?.cookies) config.headers.Cookie = `gid=${context.req.cookies.gid};`;
  } else {
    const userAuth = getUserAuth();

    if (userAuth) {
      const userId = userAuth.user_id;
      let { access_token } = userAuth;

      if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
      }
      if (userId) {
        config.headers['x-user-id'] = userId.toString();
      }
    }
  }

  return config;
});

//Response interceptor to handle unauthorized errors and retry request
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      error.response &&
      error.response.status === 419 &&
      error.response.config &&
      !error.response.config.url?.includes('auth')
    ) {
      return refreshToken(error);
    }
    return Promise.reject(error);
  }
);

let fetchingToken = false;
let subscribers: ((token: string, user_id: number) => any)[] = [];

const onAccessTokenFetched = (token: string, user_id: number) => {
  subscribers.forEach((callback) => callback(token, user_id));
  subscribers = [];
};

const addSubscriber = (callback: (token: string, user_id: number) => any) => {
  subscribers.push(callback);
};

const refreshToken = async (error: AxiosError) => {
  try {
    const { response } = error;

    // create new Promise to retry original request
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((token: string, user_id: number) => {
        response!.config.headers['Authorization'] = `Bearer ${token}`;
        response!.config.headers['x-user-id'] = user_id;
        resolve(axios(response!.config));
      });
    });

    // check whether refreshing token or not
    if (!fetchingToken) {
      fetchingToken = true;

      let data: RefreshTokenResponse = { access_token: '', refresh_token: '' };
      let _user_id = 0;

      // check if this is server or not
      if (isServer()) {
        if (context.req.headers.cookie) {
          console.log('handle refresh token on server...');
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

            const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
              refresh_token: refresh_token,
              user_id: +user_id
            });

            data = response.data;
            _user_id = +user_id;

            context.res.setHeader('Set-Cookie', [
              `user_id=${user_id}; Max-Age=604800; SameSite=Lax; Path=/`,
              `access_token=${data.access_token}; Max-Age=604800; SameSite=Lax; Path=/`,
              `refresh_token=${data.refresh_token}; Max-Age=604800; SameSite=Lax; Path=/`
            ]);
            context.res.end();
          }
        }
      } else {
        console.log('handle refresh token on client...');
        const userAuth = getUserAuth();

        const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
          refresh_token: userAuth.refresh_token,
          user_id: +userAuth.user_id
        });

        data = response.data;
        _user_id = +userAuth.user_id;

        setUserAuth({
          user_id: userAuth.user_id as string,
          ...data
        });
      }

      // when new token arrives, retry old requests with new token
      onAccessTokenFetched(data.access_token, +_user_id);
    }

    return retryOriginalRequest;
  } catch (error) {
    // on error go to login page
    if (!isServer() && !Router.asPath.includes('/auth')) {
      removeUserAuth();
      Router.push('/auth');
    }

    if (isServer() && context.res && !context.res.headersSent) {
      context.res.setHeader('Set-Cookie', [
        `user_id=; Max-Age=0; SameSite=Lax; Path=/`,
        `access_token=; Max-Age=0; SameSite=Lax; Path=/`,
        `refresh_token=; Max-Age=0; SameSite=Lax; Path=/`
      ]);
      context.res.setHeader('location', '/auth');
      context.res.statusCode = 302;
      context.res.end();
    }

    return Promise.reject(error);
  } finally {
    fetchingToken = false;
  }
};

export default api;
