export interface IGetHomeDetailParams {
  id: string;
}

export interface ISearchHomeParams {
  q: string;
}

export interface ISearchHomeByAmenitiesParams {
  amenities: string;
}

export interface IGetHomeByOwnerParams {
  homeOwnerId: string;
}

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
}

export interface ICreateHomeBody {
  address: string;
  homeOwnerId: string;
  district: string;
  province: string;
  images: string[];
  ward: string;
  building: string;
  apartmentNv: string;
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
}

export interface IUpdateHomeParams {
  id: string;
}

export interface IUpdateHomeBody {
  address?: string;
  homeOwnerId?: string;
  district?: string;
  province?: string;
  images?: string[];
  ward?: string;
  building?: string;
  apartmentNv?: string;
  active?: boolean;
  note?: string;
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
}

export interface IDeleteHomeParams {
  id: string;
} 