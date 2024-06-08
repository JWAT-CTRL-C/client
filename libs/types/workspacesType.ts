import { sourceType } from './sourcesType';

export type workspacesType = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  wksp_src: sourceType[] | [];
};
