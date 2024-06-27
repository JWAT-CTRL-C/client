import api from '@/libs/api';
import { Noti } from '@/libs/types/notiType';

export const fetchNotifications = async (pageParam: number): Promise<Noti[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/notifications?page=${pageParam}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
