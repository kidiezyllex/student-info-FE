export interface IGuest {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  hometown: string;
  note: string;
  gender?: boolean; // true for male, false for female
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IGuestSearchResult extends IGuest {}

export interface IGuestListResponse {
  statusCode: number;
  message: string;
  data: IGuest[];
}

export interface IGuestSearchResponse {
  statusCode: number;
  message: string;
  data: IGuestSearchResult[];
}

export interface IGuestDetailResponse {
  statusCode: number;
  message: string;
  data: IGuest;
}

export interface IGuestCreateResponse {
  statusCode: number;
  message: string;
  data: IGuest;
}

export interface IGuestUpdateResponse {
  statusCode: number;
  message: string;
  data: IGuest;
}

export interface IGuestDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 