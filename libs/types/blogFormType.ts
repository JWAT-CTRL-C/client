export type blogFormType = {
  blog_tle: string;
  blog_tag: string[];
  blog_wksp?: string | null;
  blog_img: File | null | string;
  blog_cont: string;
  blog_src?: string | null;
};
