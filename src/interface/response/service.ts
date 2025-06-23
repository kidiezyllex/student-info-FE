export interface IService {
  _id: string;
  name: string;
  unit: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IServiceSearchResult extends IService {}

export interface IServiceListResponse {
  statusCode: number;
  message: string;
  data: IService[];
}

export interface IServiceSearchResponse {
  statusCode: number;
  message: string;
  data: IServiceSearchResult[];
}

export interface IServiceDetailResponse {
  statusCode: number;
  message: string;
  data: IService;
}

export interface IServiceCreateResponse {
  statusCode: number;
  message: string;
  data: IService;
}

export interface IServiceUpdateResponse {
  statusCode: number;
  message: string;
  data: IService;
}

export interface IServiceDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 