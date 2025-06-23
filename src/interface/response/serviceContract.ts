export interface IServiceContract {
  _id: string;
  homeId: string;
  serviceId: string;
  guestId: string;
  homeContractId: string;
  dateStar: string;
  signDate?: string;
  dateEnd?: string;
  duration: number;
  price: number;
  unitCost?: number;
  payCycle: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IServiceContractDetail {
  _id: string;
  homeId: {
    _id: string;
    name: string;
  };
  serviceId: {
    _id: string;
    name: string;
    price: number;
  };
  guestId: {
    _id: string;
    fullname: string;
  };
  homeContractId: string;
  dateStar: string;
  signDate?: string;
  dateEnd?: string;
  duration: number;
  price: number;
  unitCost?: number;
  payCycle: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface IServiceContractListResponse {
  statusCode: number;
  message: string;
  data: {
    contracts: IServiceContract[];
  };
}

export interface IServiceContractDetailResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IServiceContractDetail;
  };
}

export interface IServiceContractCreateResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IServiceContract;
  };
}

export interface IServiceContractUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    duration?: number;
    price?: number;
    unitCost?: number;
    payCycle?: number;
    status?: number;
    dateEnd?: string;
    updatedAt: string;
  };
}

export interface IServiceContractDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
}

export interface IServiceContractSearchResponse {
  statusCode: number;
  data: {
    contracts: IServiceContract[];
  }
} 