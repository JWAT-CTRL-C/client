import { AxiosError } from 'axios';

// for all type
export enum NotificationType {
  SETUP_USER = 'setup_user',
  SETUP_WORKSPACE = 'setup_workspace',
  CREATE_GLOBAL = 'create_global_notification',
  CREATE_WORKSPACE = 'create_workspace_notification',
  CREATE_SYSTEM_GLOBAL = 'create_system_global_notification',
  CREATE_SYSTEM_WORKSPACE = 'create_system_workspace_notification',
  NEW = 'new_notification',
  CREATE_RATING = 'create_rating_notification'
}

export type ErrorResponseType = Error & {
  response: {
    status: number;
    data: {
      message: string | string[];
    };
  };
} & AxiosError;
export type GENERAL_RESPONSE_TYPE = {
  success: boolean;
  message: string;
};

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';
