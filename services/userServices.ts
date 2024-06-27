import api from '@/libs/api';
import { User, UserForm, UserFormForAdmin, UserResponseWithPagination } from '@/libs/types/userType';
import { filterFalsyFields } from '@/libs/utils';

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

export const getAllUsersForAdmin = (page: number = 1) => {
  return new Promise<UserResponseWithPagination>((resolve, reject) => {
    api
      .get<UserResponseWithPagination>(`/users/all/admin?page=${page}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const removeUser = (user_id: number) => {
  return new Promise<void>((resolve, reject) => {
    api
      .delete(`/users/${user_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const restoreUser = (user_id: number) => {
  return new Promise<void>((resolve, reject) => {
    api
      .patch(`/users/${user_id}/restore`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const createUser = async (user: Omit<UserFormForAdmin, 'user_id'>) => {
  const value = filterFalsyFields(user);
  return new Promise<void>((resolve, reject) => {
    api
      .post(`/users`, value)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
