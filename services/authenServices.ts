import { baseURL } from '@/axiosConfig';
import { RefreshTokenResponse } from '@/libs/types/RefreshTokenResponse';
import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { getUserAuth, removeUserAuth, setUserAuth } from '@/libs/utils';
import axios from 'axios';
import Cookies from 'js-cookie';

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

// Function to refresh token
export const refreshToken = async (): Promise<string> => {
  try {
    const userAuth = getUserAuth();

    if (!userAuth) {
      throw new Error('refreshToken : No refresh token available');
    }

    const { refresh_token, user_id } = userAuth;


    const response = await axios.post<RefreshTokenResponse>(`${baseURL}/auth/refresh`, {
      refresh_token: refresh_token,
      user_id: user_id.toString()
    });

    //console.log('refreshToken - api get token ', response);
    const newAuth = response.data;
    setUserAuth({
      user_id: userAuth.user_id,
      ...newAuth
    });
    return newAuth.access_token;
  } catch (error: any) {
    console.error('Unable to refresh token:', error.response?.data?.message || error.message);
    removeUserAuth();
    //signOut();
    throw error;
  }
};
