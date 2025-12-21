export interface IDatasetDepartment {
  _id: string;
  name: string;
}

export interface IDatasetItem {
  _id: string;
  key: string;
  value: string;
  category: string;
  department: IDatasetDepartment;
  createdAt: string;
}

export interface IDatasetItemCreate {
  _id: string;
  key: string;
  value: string;
  category: string;
  department: string;
  createdAt: string;
}

export interface IGetAllDatasetItemsResponse {
  message: string;
  data: IDatasetItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IGetDatasetItemByIdResponse {
  message: string;
  data: IDatasetItem;
}

export interface ICreateDatasetItemResponse {
  message: string;
  data: IDatasetItemCreate;
}

export interface IUpdateDatasetItemResponse {
  message: string;
  data: IDatasetItemCreate;
}

export interface IDeleteDatasetItemResponse {
  message: string;
} 