import axiosInstance from '@/axiosConfig';
import { GENERAL_RESPONSE_TYPE } from '@/libs/types';
import _ from 'lodash';
import { USER_TYPE } from './userServices';
export type CREATE_WORKSPACE_REQUEST = {
  wksp_name: string;
  wksp_desc: string;
};
export type UPDATE_WORKSPACE_REQUEST = Partial<CREATE_WORKSPACE_REQUEST> & { wksp_id: string };
export type WORKSPACES_RESPONSE = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  users: {
    user_id: number;
    usrn: string;
    email: string | null;
    fuln: string | null;
    role: string;
    avatar: string | null;
  }[];
};
export type SPECIFIC_WORKSPACE_RESPONSE = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  users: Partial<USER_TYPE> &
    {
      fuln: string | null;
      email: string | null;
    }[];
  owner: USER_TYPE;
  resources: {
    resrc_id: string;
    resrc_name: string;
    resrc_url: string;
  }[];
};
export type WORKSPACE_MEMBER = {
  wksp_id: string;
  wksp_name: string;
  wksp_desc: string;
  owner: USER_TYPE;
  users: USER_TYPE[];
};

export const getWorkspacesByUser = () => {
  return new Promise<WORKSPACES_RESPONSE[]>((resolve, reject) => {
    axiosInstance
      .get<WORKSPACES_RESPONSE[]>('/workspaces/me')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSpecificWorkspace = (wksp_id: string) => {
  return new Promise<SPECIFIC_WORKSPACE_RESPONSE>((resolve, reject) => {
    axiosInstance
      .get<SPECIFIC_WORKSPACE_RESPONSE>(`/workspaces/${wksp_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const createWorkspace = (wkspData: CREATE_WORKSPACE_REQUEST) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .post<GENERAL_RESPONSE_TYPE>('/workspaces', wkspData)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const updateWorkspace = (wkspData: UPDATE_WORKSPACE_REQUEST) => {
  console.log(`/workspaces/${wkspData.wksp_id}`, _.omit(wkspData, 'wksp_id'));
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .patch<GENERAL_RESPONSE_TYPE>(`/workspaces/${wkspData.wksp_id}`, _.omit(wkspData, 'wksp_id'))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const deleteWorkspace = (wksp_id: string) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .delete<GENERAL_RESPONSE_TYPE>(`/workspaces/${wksp_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const addMemberToWorkspace = (wksp_id: string, user_id: number) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .post<GENERAL_RESPONSE_TYPE>(`/workspaces/${wksp_id}/member`, { user_id })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export const removeMemberFromWorkspace = (wksp_id: string, user_id: number) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .delete<GENERAL_RESPONSE_TYPE>(`/workspaces/${wksp_id}/member/${user_id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const franchiseWorkspace = (wksp_id: string, new_owner_id: number) => {
  return new Promise<GENERAL_RESPONSE_TYPE>((resolve, reject) => {
    axiosInstance
      .post<GENERAL_RESPONSE_TYPE>(`/workspaces/${wksp_id}/franchise`, { user_id: new_owner_id })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
export const getWorkspaceMembers = (wksp_id: string) => {
  return new Promise<WORKSPACE_MEMBER>((resolve, reject) => {
    axiosInstance
      .get<WORKSPACE_MEMBER>(`/workspaces/${wksp_id}/member`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};
