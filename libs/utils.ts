import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { LoginResponse } from './types/authType';
import Cookies from 'js-cookie';
import { BlogCardType } from './types/blogCardType';
import { BlogResponse } from './types/blogResponse';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertIsotoDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const setUserAuth = (data: { access_token: string; refresh_token: string; user_id: string }) => {
  Cookies.set('userAuth', JSON.stringify(data), { expires: 7 });
};

export const getUserAuth = (): LoginResponse => {
  const userAuth = Cookies.get('userAuth');
  return userAuth ? JSON.parse(userAuth) : null;
};

export const removeUserAuth = () => {
  Cookies.remove('userAuth');
};
export const transformBlogData = (blogs: BlogResponse[]): BlogCardType[] => {
  return blogs.map((blog) => ({
    blog_id: blog.blog_id,
    blog_tle: blog.blog_tle,
    blog_cont: blog.blog_cont,
    crd_at: blog.crd_at,
    blog_image: blog.blogImage ? blog.blogImage.blog_img_url : null,
    auth_img: null,
    auth_name: blog.user.fuln,
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
