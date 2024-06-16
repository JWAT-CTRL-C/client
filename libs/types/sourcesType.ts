import { BlogResponse } from "./blogResponse";

export type ResourceType = {
  resrc_id:   string;
  resrc_name: string;
  resrc_url:  string;
  crd_at:     Date;
  upd_at: Date;
  blog : BlogResponse
};
