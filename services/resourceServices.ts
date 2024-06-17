import api from '@/libs/api';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
export type RESOURCE_TYPE = {
  resrc_id: string;
  resrc_name: string;
  resrc_url: string;
};
export type RESOURCE_REQUEST = Omit<RESOURCE_TYPE, 'resrc_id'>;
export type UPDATE_RESOURCE_REQUEST = Partial<RESOURCE_REQUEST> & {};
export type SPECIFIC_RESOURCE_RESPONSE = RESOURCE_TYPE & {};
export const getAllResources = (wksp_id: string) => {
  return new Promise<RESOURCE_TYPE[]>((resolve, reject) => {
    api
      .get<RESOURCE_TYPE[]>(`/resources/${wksp_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const getSpecificResource = (wksp_id: string, resrc_id: string) => {
  return new Promise((resolve, reject) => {
    api
      .get<SPECIFIC_RESOURCE_RESPONSE>(`/resources/${wksp_id}/${resrc_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const removeResource = (wksp_id: string, resrc_id: string) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    api
      .delete<GENERAL_RESPONSE_TYPE>(`/resources/${wksp_id}/${resrc_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const createResource = (wksp_id: string, resource: RESOURCE_REQUEST) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    api
      .post<GENERAL_RESPONSE_TYPE>(`/resources/${wksp_id}/add`, resource)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const updateResource = (wksp_id: string, resrc_id: string, resource: UPDATE_RESOURCE_REQUEST) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    api
      .patch<GENERAL_RESPONSE_TYPE>(`/resources/${wksp_id}/${resrc_id}`, resource)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
