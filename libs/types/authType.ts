export type LoginRequest = {
  usrn: string;
  pass: string;
};

export type LoginResponse = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};
