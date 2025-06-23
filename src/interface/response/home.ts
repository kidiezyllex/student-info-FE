export interface IHomeOwner {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  bank: string;
  bankAccount: string;
  bankNumber: string;
  active: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IHome {
  _id: string;
  address: string;
  province?: string;
  district: string;
  ward: string;
  building: string;
  apartmentNv: string;
  homeOwnerId: IHomeOwner;
  homeContract?: {
    _id: string;
    guestId: string;
    status: number;
  } | null;
  active: boolean;
  note: string;
  images: string[];
  price?: number;

  // Amenities
  hasBathroom?: boolean;
  hasBedroom?: boolean;
  hasBalcony?: boolean;
  hasKitchen?: boolean;
  hasWifi?: boolean;
  hasSoundproof?: boolean;
  hasAirConditioner?: boolean;
  hasWashingMachine?: boolean;
  hasRefrigerator?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasSecurity?: boolean;
  hasGym?: boolean;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasPetAllowed?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IHomeAvailable {
  _id: string;
  name: string;
  address: string;
  area: number;
  floor: number;
  bedroom: number;
  toilet: number;
  homeOwnerId: string;
  status: number;
  price: number;
}

export interface IHomeSearchResult {
  _id: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  building: string;
  apartmentNv: string;
  images: string[];
  homeOwnerId: IHomeOwner;
  homeContract?: {
    _id: string;
    guestId: string;
    status: number;
  } | null;
  active: boolean;
  note: string;
  // Amenities
  hasBathroom?: boolean;
  hasBedroom?: boolean;
  hasBalcony?: boolean;
  hasKitchen?: boolean;
  hasWifi?: boolean;
  hasSoundproof?: boolean;
  hasAirConditioner?: boolean;
  hasWashingMachine?: boolean;
  hasRefrigerator?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasSecurity?: boolean;
  hasGym?: boolean;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasPetAllowed?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IHomeDetail {
  _id: string;
  name: string;
  address: string;
  area: number;
  floor: number;
  bedroom: number;
  toilet: number;
  homeOwnerId: {
    _id: string;
    fullname: string;
  };
  status: number;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHomeListResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHome[];
  };
}

export interface IHomeAvailableListResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHomeAvailable[];
  };
}

export interface IHomeSearchResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHomeSearchResult[];
  };
}

export interface IHomeListByOwnerResponse {
  statusCode: number;
  message: string;
  data: IHome[];
}

export interface IHomeDetailResponse {
  statusCode: number;
  message: string;
  data: {
    home: IHome;
  };
}

export interface IHomeCreateResponse {
  statusCode: number;
  message: string;
  data: {
    home: IHome;
  };
}

export interface IHomeUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    updatedAt: string;
  };
}

export interface IHomeDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 