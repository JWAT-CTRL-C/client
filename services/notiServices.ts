import api from '@/libs/api';
import { Noti } from '@/libs/types/notiType';

export const fetchNotifications = async (): Promise<Noti[]> => {
  return new Promise((resolve, reject) => {
    api
      .get('/notifications')
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
