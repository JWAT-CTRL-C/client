import api from '@/libs/api';
import { User, UserForm } from '@/libs/types/userType';

export type USER_TYPE = {
  user_id: number;
  usrn: string;
  fuln: string;
  avatar: string;
  email: string;
  phone: string;
  role: 'HM' | 'PM' | 'EM' | 'MA';
};
export const fetchUserById = async (user_id: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/users/${user_id}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    api
      .post('/users/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => resolve(response.data.data.url))
      .catch((error) => reject(error));
  });
};

export const updateUser = async (user: UserForm): Promise<User> => {
  return new Promise((resolve, reject) => {
    api
      .patch(`/users/${user.user_id}`, user)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const getAllUsers = () => {
  return new Promise<USER_TYPE[]>((resolve, reject) => {
    api
      .get<USER_TYPE[]>('/users/all')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
