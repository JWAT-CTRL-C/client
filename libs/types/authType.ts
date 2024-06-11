export type LoginRequest = {
  usrn: string;
  pass: string;
};

export type LoginResponse = {
  user_id: string;
  accessToken: string;
  refreshToken: string;
};
