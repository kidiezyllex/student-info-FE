export interface IActivityLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface IActivityLog {
  _id: string;
  user: IActivityLogUser;
  action: "CREATE" | "UPDATE" | "DELETE" | string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface IActivityLogResponse {
  success: boolean;
  data: IActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
