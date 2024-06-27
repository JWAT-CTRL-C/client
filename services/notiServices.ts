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
export const fetchWorkspaceNotifications = (pageParam: number, wksp_id: string) => {
  return new Promise<Noti[]>((resolve, reject) => {
    api
      .get(`/notifications/${wksp_id}?page=${pageParam}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
export const markSeenNotification = (noti_id: string) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/users/${noti_id}/seen`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
export const getUnreadAmount = () => {
  return new Promise<number>((resolve, reject) => {
    api
      .get<{ unreadAmount: number }>('/notifications/unread')
      .then((response) => resolve(response.data.unreadAmount))
      .catch((error) => reject(error));
  });
};
