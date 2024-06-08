export type blogFormType = {
  title: string;
  tag: string[];
  workspace?: string | null;
  backgroundImg: File | null | string;
  content: string;
  source?: string;
};
