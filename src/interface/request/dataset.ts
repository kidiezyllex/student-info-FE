export interface ICreateDatasetItemBody {
  key: string;
  value: string;
  category: string;
  department?: string;
}

export interface IUpdateDatasetItemBody {
  key?: string;
  value?: string;
  category?: string;
  department?: string;
}

export interface IDatasetQueryParams {
  category?: string;
  department?: string;
} 