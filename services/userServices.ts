import api from '@/libs/api';
import { User, UserForm } from '@/libs/types/userType';

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
