export interface IGetServiceContractByHomeParams {
  homeId: string;
}

export interface IGetServiceContractByGuestParams {
  guestId: string;
}

export interface IGetServiceContractByHomeContractParams {
  homeContractId: string;
}

export interface IGetServiceContractByServiceParams {
  serviceId: string;
}

export interface IGetServiceContractDetailParams {
  id: string;
}

export interface ICreateServiceContractBody {
  homeId: string;
  serviceId: string;
  guestId: string;
  homeContractId: string;
  dateStar: string;
  duration: number;
  price: number;
  payCycle: number;
}

export interface IUpdateServiceContractParams {
  id: string;
}

export interface IUpdateServiceContractBody {
  duration?: number;
  price?: number;
  payCycle?: number;
  status?: number;
}

export interface IDeleteServiceContractParams {
  id: string;
}

export interface ISearchServiceContractParams {
  q: string;
} 