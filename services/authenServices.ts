import api from '@/libs/api';
import { LoginRequest, LoginResponse } from '@/libs/types/authType';

export const login = async (credentials: LoginRequest) => {
  return new Promise<LoginResponse>((resolve, reject) => {
    api
      .post<LoginResponse>(`/auth/login`, credentials)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
