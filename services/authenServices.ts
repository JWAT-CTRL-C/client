import { baseURL } from '@/libs/api';
import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { setUserAuth } from '@/libs/utils';
import axios from 'axios';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${baseURL}/auth/login`, credentials);

    const data = response.data;

    setUserAuth(data);

    return data;
  } catch (error: any) {
    throw error || new Error(error.response?.data?.message || 'Failed to login');
  }
};
