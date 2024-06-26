import { clsx, type ClassValue } from 'clsx';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';
import { LoginResponse } from './types/authType';
import { blogTableType } from './types/blogTableType';

import moment from 'moment-timezone';
import { createBreakpoint } from 'react-use';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertIsoToDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const setUserAuth = (data: LoginResponse) => {
  Cookies.set('user_id', data.user_id, { expires: 7 });
  Cookies.set('access_token', data.access_token, { expires: 7 });
  Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
  Cookies.remove('expired');
};

export const getUserAuth = () => {
  const user_id = Cookies.get('user_id') || 0;
  const access_token = Cookies.get('access_token') || '';
  const refresh_token = Cookies.get('refresh_token') || '';
  return { user_id, access_token, refresh_token };
};

export const removeUserAuth = () => {
  Cookies.remove('user_id');
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export const isTokenExpired = (token: string): boolean => {
  const decodedToken: any = jwtDecode(token);
  return decodedToken.exp < Date.now() / 1000;
};

export const transformBlogTableType = (blogs: any[]): blogTableType[] => {
  return blogs?.map((blog) => ({
    blog_id: blog.blog_id,
    blog_tle: blog.blog_tle,
    blog_cont: blog.blog_cont,
    crd_at: blog.crd_at,
    upd_at: blog.upd_at,
    blog_tag: blog.tags,
    blog_cmt: blog.blogComments,
    blog_rtg: blog.blogRatings,
    blog_img_url: blog.blogImage?.blog_img_url
  }));
};

export const pushHash = (hash: string = '') => {
  window.location.hash = hash;
};
export const getHash = () => {
  return window.location.hash.slice(1);
};
// check falsy
export function filterFalsyFields<T extends object>(data: T): Partial<T> {
  return _.omitBy(data, (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === null || value === undefined || value === false || value === '';
  });
}
export const getTimeDifference = (timestamp: string): string => {
  const vietnamTime = moment.tz(timestamp, 'Asia/Ho_Chi_Minh');
  const now = moment();

  const duration = moment.duration(now.diff(vietnamTime));
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const days = duration.asDays();
  const weeks = duration.asWeeks();

  if (weeks >= 1) {
    return `posted ${Math.floor(weeks)} week${Math.floor(weeks) > 1 ? 's' : ''} ago`;
  } else if (days >= 1) {
    return `posted ${Math.floor(days)} day${Math.floor(days) > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `posted ${Math.floor(hours)} hour${Math.floor(hours) > 1 ? 's' : ''} ago`;
  } else if (minutes >= 1) {
    return `posted ${Math.floor(minutes)} minute${Math.floor(minutes) > 1 ? 's' : ''} ago`;
  } else {
    return 'posted just now';
  }
};

export const useBreakpoint = createBreakpoint({
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 320
});
