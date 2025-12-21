export interface ICreateNotificationBody {
  title: string;
  content: string;
  type: string;
  department?: string | null; // Allow null for department
  startDate?: string;
  endDate?: string;
  isImportant?: boolean;
}

export interface IUpdateNotificationBody {
  title?: string;
  content?: string;
  type?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  isImportant?: boolean;
}

export interface INotificationQueryParams {
  type?: string;
  department?: string;
  page?: number;
  limit?: number;
} 