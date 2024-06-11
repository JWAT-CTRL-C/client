import { RefreshTokenResponse } from '@/libs/types/RefreshTokenResponse';
import { LoginRequest, LoginResponse } from '@/libs/types/authType';
import { getUserAuth, removeUserAuth, setUserAuth } from '@/libs/utils';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = 'http://localhost:8080/api';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${baseURL}/auth/login`, credentials);

    const data = response.data;
    Cookies.set('userAuth', JSON.stringify(data), { expires: 7 });

    setUserAuth(data);

    return data;
  } catch (error: any) {
    console.error('Error during login:', error);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Function to refresh token
export const refreshToken = async (): Promise<string> => {
  try {
    const userAuth = getUserAuth();

    if (!userAuth) {
      throw new Error('refreshToken : No refresh token available');
    }

    const { refreshToken, user_id } = userAuth;
    const response = await axios.post<RefreshTokenResponse>(`${baseURL}/auth/refresh`, {
      refresh_token: refreshToken,
      user_id: user_id.toString()
    });

    //console.log('refreshToken - api get token ', response);
    const newAuth = response.data;
    setUserAuth({
      user_id: userAuth.user_id,
      ...newAuth
    });
    return newAuth.accessToken;
  } catch (error: any) {
    console.error('Unable to refresh token:', error.response?.data?.message || error.message);
    removeUserAuth();
    //signOut();
    throw error;
  }
};
