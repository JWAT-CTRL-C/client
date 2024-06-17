import { clsx, type ClassValue } from 'clsx';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { twMerge } from 'tailwind-merge';
import { LoginResponse } from './types/authType';
import { BlogCardType } from './types/blogCardType';
import { BlogResponse } from './types/blogResponse';
import { blogTableType } from './types/blogTableType';
import _ from 'lodash';

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

export const setUserAuth = (data: { access_token: string; refresh_token: string; user_id: string }) => {
  // Cookies.set('userAuth', JSON.stringify(data), { expires: 7 });
  Cookies.set('user_id', data.user_id, { expires: 7 });
  Cookies.set('access_token', data.access_token, { expires: 7 });
  Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
};

export const getUserAuth = (): Partial<LoginResponse> => {
  // const userAuth = Cookies.get('userAuth');
  // return userAuth ? JSON.parse(userAuth) : null;
  const user_id = Cookies.get('user_id');
  const access_token = Cookies.get('access_token');
  const refresh_token = Cookies.get('refresh_token');
  return { user_id, access_token, refresh_token };
};

export const removeUserAuth = () => {
  // Cookies.remove('userAuth');
  Cookies.remove('user_id');
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};
export const transformBlogData = (blogs: BlogResponse[]): BlogCardType[] => {
  return blogs.map((blog) => ({
    blog_id: blog.blog_id,
    blog_tle: blog.blog_tle,
    blog_cont: blog.blog_cont,
    crd_at: blog.crd_at,
    blog_image: blog.blogImage ? blog.blogImage.blog_img_url : null,
    auth_img: null,
    auth_name: blog.user.fuln || blog.user.usrn,
    blog_rtg:
      blog.blogRatings.length > 0
        ? blog.blogRatings.reduce((acc: any, rating: { blog_rtg: any }) => acc + rating.blog_rtg, 0) /
          blog.blogRatings.length
        : 0,
    blog_tag: blog.tags
  }));
};

export const isTokenExpired = (token: string): boolean => {
  const decodedToken: any = jwtDecode(token);
  return decodedToken.exp < Date.now() / 1000;
};

export const transformBlogTableType = (blogs: any[]): blogTableType[] => {
  return blogs.map((blog) => ({
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
