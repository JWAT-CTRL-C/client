// for all type
export enum NotificationType {
  SETUP_WORKSPACE = 'setup_workspace',
  CREATE_NORMAL = 'create_normal_notification',
  CREATE_WORKSPACE = 'create_workspace_notification',
  NEW = 'new_notification'
}

export type ErrorResponseType = Error & {
  response: {
    status: number;
    data: {
      message: string | string[];
    };
  };
};
export type GENERAL_RESPONSE_TYPE = {
  success: boolean;
  message: string;
};

export type RolesType = 'MA' | 'HM' | 'PM' | 'EM';
