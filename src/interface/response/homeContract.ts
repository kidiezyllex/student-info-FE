import { IPagination } from './pagination';

export interface IHomeContract {
  _id: string;
  homeId: string | { _id: string; name: string };
  guestId: string | { _id: string; fullname: string; phone: string };
  contractCode: string;
  dateStar: string;
  duration: number;
  price: number;
  deposit: number;
  payCycle: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHomeContractSearch {
  _id: string;
  guestId: {
    _id: string;
    fullname: string;
    phone: string;
  };
  homeId: {
    _id: string;
    name: string;
  };
  duration: number;
  payCycle: number;
  renta: number;
  dateStar: string;
  deposit: number;
  status: number;
}

export interface IHomeContractDetail extends IHomeContract {
  // Thêm các trường bổ sung nếu cần
}

export interface IHomeContractListResponse {
  statusCode: number;
  message: string;
  data: {
    contracts: IHomeContract[];
    pagination?: IPagination;
  };
}

export interface IHomeContractSearchResponse {
  statusCode: number;
  message: string;
  data: {
    contracts: IHomeContract[];
    pagination?: IPagination;
  };
}

export interface IHomeContractDetailResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IHomeContractDetail;
  };
}

export interface IHomeContractCreateResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IHomeContract;
  };
}

export interface IHomeContractUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IHomeContract;
  };
}

export interface IHomeContractDeleteResponse {
  statusCode: number;
  message: string;
} 