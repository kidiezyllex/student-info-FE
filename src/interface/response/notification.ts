export interface INotificationDepartment {
  _id: string;
  name: string;
}

export interface INotification {
  _id: string;
  title: string;
  content: string;
  type: string;
  department: INotificationDepartment;
  startDate: string;
  endDate: string;
  isImportant: boolean;
  createdAt: string;
}

export interface INotificationCreate {
  _id: string;
  title: string;
  content: string;
  type: string;
  department: string;
  startDate: string;
  endDate: string;
  isImportant: boolean;
  createdAt: string;
}

export interface IGetNotificationsResponse {
  message: string;
  data: INotification[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IGetNotificationByIdResponse {
  message: string;
  data: INotification;
}

export interface ICreateNotificationResponse {
  message: string;
  data: INotificationCreate;
}

export interface IUpdateNotificationResponse {
  message: string;
  data: INotificationCreate;
}

export interface IDeleteNotificationResponse {
  message: string;
}

export interface IGetSavedNotificationsResponse {
  message: string;
  data: INotification[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ISaveNotificationResponse {
  message: string;
}

export interface IUnsaveNotificationResponse {
  message: string;
} 