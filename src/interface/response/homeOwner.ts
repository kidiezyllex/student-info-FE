export interface IHomeOwner {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  address: string;
  bankAccount: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IHomeOwnerSearchResult {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
}

export interface IHomeOwnerListResponse {
  statusCode: number;
  message: string;
  data: {
    owners: IHomeOwner[];
  };
}

export interface IHomeOwnerSearchResponse {
  statusCode: number;
  message: string;
  data: {
    owners: IHomeOwnerSearchResult[];
  };
}

export interface IHomeOwnerDetailResponse {
  statusCode: number;
  message: string;
  data: {
    owner: IHomeOwner;
  };
}

export interface IHomeOwnerCreateResponse {
  statusCode: number;
  message: string;
  data: {
    owner: IHomeOwner;
  };
}

export interface IHomeOwnerUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    phone?: string;
    bankAccount?: string;
    bankName?: string;
    updatedAt: string;
  };
}

export interface IHomeOwnerDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 