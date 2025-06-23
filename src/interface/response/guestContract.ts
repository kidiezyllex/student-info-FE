export interface IGuestInfo {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
}

export interface IHomeContractInfo {
  _id: string;
  homeId: {
    _id: string;
    address: string;
  };
  duration: number;
  renta: number;
  status: number;
}

export interface IServiceContractInfo {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
  };
  price: number;
  status: number;
}

export interface IGuestContractData {
  guestInfo: IGuestInfo;
  homeContracts: IHomeContractInfo[];
  serviceContracts: IServiceContractInfo[];
}

export interface IGuestContractResponse {
  statusCode: number;
  message: string;
  data: IGuestContractData;
} 